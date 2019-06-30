import { afterUpdate } from 'svelte';
import { writable, get } from 'svelte/store';
import * as rules from './rules';

function getValue(field) {
  return field.value;
}

function isPromise(obj) {
  // Standard promise API always has a `then` method
  return !!obj.then;
}

function validate(value, { field, validator, observable }) {
  let valid = true;
  let pending = false;
  let rule;
  
  if (typeof validator === 'function') {
    const resp = validator.call(null, value);

    if (isPromise(resp)) {
      pending = true;
      resp.then(({ name, valid }) => {
        observable.update(n => {
          n[field] = n[field] || { errors: [] };

          n[field].pending = false;
          n[field].valid = valid;

          if (!valid) {
            n[field].errors.push(rule);
          }

          return n;
        });
      });
    } else {
      valid = resp.valid;
      rule = resp.name;
    }
  } else {
    const params = validator.split(/:/g);
    rule = params.shift();
    valid = rules[rule].call(null, value, params);
  }

  return [valid, rule, pending];
}

function field(name, config, observable, { stopAtFirstError }) {
    const { value, validators = [] } = config;
    let valid = true;
    let pending = false;
    let errors = [];

    for (let i = 0; i < validators.length; i++) {
      const [isValid, rule, isPending] = validate(value, { field: name, validator: validators[i], observable });

      if (!pending && isPending) {
        pending = true;
      }
      
      if (!isValid) {
        valid = false;
        errors = [...errors, rule];

        if (stopAtFirstError) break;
      }
    }

    return { valid, errors, pending };
}

export function bindClass(node, { form, name, valid = 'valid', invalid = 'invalid' }) {
  const key = name || node.getAttribute('name');

  const unsubscribe = form.subscribe((context) => {
    if (context.dirty && context[key] && context[key].valid) {
      node.classList.add(valid);
    } else {
      node.classList.remove(valid);
    }
  
    if (context.dirty && context[key] && !context[key].valid) {
      node.classList.add(invalid);
    } else {
      node.classList.remove(invalid);
    }
  });

  return {
    destroy: unsubscribe
  }
}

export function form(fn, config = { initCheck: false, stopAtFirstError: true }) {
  const storeValue = writable({ oldValues: {}, dirty: false  });
  
  afterUpdate(() => walkThroughFields(fn, storeValue, config));

  walkThroughFields(fn, storeValue, config);

  return storeValue;
}

function walkThroughFields(fn, observable, config) {
  const fields = fn.call();
  const returnedObject = { oldValues: {}, dirty: false };
  const context = get(observable);

  returnedObject.dirty = context.dirty;

  Object.keys(fields).forEach(key => {
    const value = getValue(fields[key]);

    if (value !== context.oldValues[key]) {
      returnedObject[key] = field(key, fields[key], observable, config);
    }
    else {
      returnedObject[key] = context[key];
    }

    returnedObject.oldValues[key] = value;
    
    console.log("Old: %s, value: %s", context.oldValues[key], value);
    
    if (!context.dirty && context.oldValues[key] !== undefined && value !== context.oldValues[key]) {
      returnedObject.dirty = true;
    }
  });

  returnedObject.valid = !Object.keys(returnedObject).find(f => {
    if (['oldValues', 'dirty'].includes(f)) return false;
    return !returnedObject[f].valid;
  });

  observable.set(returnedObject);
}

