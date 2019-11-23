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

function validate(value, { field, validator, observable, enabled }) {
  let valid = true;
  let pending = false;
  let rule;

  if (enabled === false) {
    return [valid, pending, rule];
  }
  else if (typeof validator === 'function') {
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
    const { value, validators = [], enabled = true } = config;
    let valid = true;
    let pending = false;
    let errors = [];

    if (enabled) {
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

export function form(fn, config = {}) {
  const storeValue = writable({ oldValues: {}, dirty: false  });
  const { subscribe, set, update } = storeValue;
  config = Object.assign({ initCheck: true, validateOnChange: true, stopAtFirstError: true}, config);
  
  if (config.validateOnChange) {
    afterUpdate(() => walkThroughFields(fn, storeValue, config));
  }


  if (config.initCheck) {
    walkThroughFields(fn, storeValue, config);
  }

  return {
    subscribe, set, update,

    validate() {
      walkThroughFields(fn, storeValue, config);  
    }
  };
}

function walkThroughFields(fn, observable, config) {
  const fields = fn.call();
  const returnedObject = { oldValues: {}, dirty: false };
  const context = get(observable);

  returnedObject.dirty = context.dirty;

  Object.keys(fields).forEach(key => {
    const value = getValue(fields[key]);
    const enabled = fields[key].enabled;
    const oldValue = context.oldValues[key] || { value: undefined, enabled: true };

    if (enabled !== oldValue.enabled || value !== oldValue.value) {
      returnedObject[key] = field(key, fields[key], observable, config);
    }
    else {
      returnedObject[key] = context[key];
        
      if (!enabled) {
        returnedObject[key].valid = true;
        returnedObject[key].errors = [];
      }
    }

    returnedObject.oldValues[key] = { value, enabled };
    
    if (!context.dirty && oldValue.value !== undefined && value !== oldValue.value) {
      returnedObject.dirty = true;
    }
  });

  returnedObject.valid = !Object.keys(returnedObject).find(f => {
    if (['oldValues', 'dirty'].includes(f)) return false;
    return !returnedObject[f].valid;
  });

  observable.set(returnedObject);
}

