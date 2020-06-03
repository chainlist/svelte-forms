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

function validate(fieldName, value, validator, observable, enabled = true) {
  let valid = true;
  let pending = false;
  let rule;

  if (enabled === false) {
    return [valid, rule, pending];
  } else if (typeof validator === 'function') {
    const resp = validator.call(null, value);

    if (isPromise(resp)) {
      pending = true;
      resp.then(({ name, valid }) => {
        observable.update((n) => {
          n[fieldName] = n[fieldName] || { errors: [] };

          n[fieldName].pending = false;
          n[fieldName].valid = valid;

          if (!valid) {
            n[fieldName].errors.push(name);
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

function validateField(data, observable, { stopAtFirstFieldError }) {
  const { name, value, validators = [], enabled = true } = data;

  let valid = true;
  let pending = false;
  let errors = [];

  if (enabled) {
    validators.some((validator) => {
      const [isValid, rule, isPending] = validate(
        name,
        value,
        validator,
        observable
      );

      if (!pending && isPending) {
        pending = true;
      }

      if (!isValid) {
        valid = false;
        errors = [...errors, rule];

        return stopAtFirstFieldError;
      }
    });
  }

  return { data, valid, errors, pending };
}

export function bindClass(
  node,
  { form, name, valid = 'valid', invalid = 'invalid' }
) {
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
  };
}

export function form(fn, config = {}) {
  const fields = fn.call();
  const initialFieldsData = Object.fromEntries(
    Object.keys(fields).map((key) => [
      key,
      { name: fields[key].name, value: fields[key].value }
    ])
  );

  console.debug({ initialFieldsData });

  const storeValue = writable({
    fields: {},
    oldFields: {},
    dirty: false,
    valid: true,
  });
  const { subscribe, set, update } = storeValue;
  config = Object.assign(
    {
      initCheck: true,
      validateOnChange: true,
      stopAtFirstError: false,
      stopAtFirstFieldError: true
    },
    config
  );

  if (config.validateOnChange) {
    setTimeout(() => {
      afterUpdate(() =>
        walkThroughFields(fn, storeValue, initialFieldsData, config)
      );
    }, 0);
  }

  if (config.initCheck) {
    walkThroughFields(fn, storeValue, initialFieldsData, config);
  }

  return {
    subscribe,
    set,
    update,

    validate() {
      walkThroughFields(fn, storeValue, initialFieldsData, config);
    },
  };
}

function walkThroughFields(fn, observable, initialFieldsData, config) {
  const fields = fn.call();
  const context = get(observable);
  const returnedObject = {
    fields: {},
    oldFields: {},
    dirty: false,
  };

  Object.keys(fields).some((key) => {
    const field = fields[key];
    const oldField = context.fields[key] || {
      data: {},
      errors: [],
      pending: false,
      valid: true,
      enabled: true
    };
    const initialFieldData = initialFieldsData[key];

    const value = getValue(field);
    const oldValue = getValue(oldField);
    const enabled = field.enabled;
    const oldEnabled = oldField.enabled;

    if (enabled !== oldEnabled || value !== oldValue) {
      returnedObject.fields[key] = validateField(field, observable, config);
    } else {
      returnedObject.fields[key] = context.fields[key];

      if (!enabled) {
        returnedObject.fields[key].valid = true;
        returnedObject.fields[key].errors = [];
      }
    }

    if (value !== initialFieldData.value) {
      returnedObject.dirty = true;
    }

    returnedObject.oldFields[key] = oldField;

    if (config.stopAtFirstError) {
      return !returnedObject.fields[key].valid;
    }
  });

  returnedObject.valid = !Object.keys(returnedObject.fields).find(
    (f) => !returnedObject.fields[f].valid
  );

  observable.set(returnedObject);
}
