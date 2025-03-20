import { useRef, useReducer } from "react";

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

const useForm = (params = {}) => {
  const { defaultSchema, defaultValues = {} } = params;

  const forceUpdate = useReducer(() => ({}))[1];

  const _ = useRef({
    registered: {},
    elements: {},
    errors: {},
    schema: cloneDeep(defaultSchema),
    defaultValues: cloneDeep(defaultValues),
    values: cloneDeep(defaultValues),
  }).current;

  const methods = useRef({
    register: (name) => {
      if (!_.registered[name]) {
        _.registered[name] = {
          ref: (element) => {
            if (element instanceof HTMLElement) {
              _.elements[name] = element;
            }
          },
          onChange: (value) => {
            _.values[name] = value;
            _.registered[name].control.setValue?.(value);
          },
          control: {
            setValue: null,
            get value() {
              const value = _.values[name];
              const type = _.schema[name].type;
              return value ?? (type === "checkbox" ? [] : "");
            },
          },
        };
      }

      return {
        ..._.registered[name],
        ..._.schema[name],
        ...(_.errors[name] && Object.values(_.errors[name])[0]),
      };
    },
    getValues: () => {
      return cloneDeep(_.values);
    },
    getErrors: () => {
      return cloneDeep(_.errors);
    },
    getLabel: (name) => {
      const { label, required } = _.schema[name];
      return { label, required };
    },
    setValue: (name, value) => {
      _.values[name] = cloneDeep(value);
      _.registered[name]?.control.setValue?.(_.values[name]);
    },
    setFocus: (name) => {
      _.elements[name]?.focus?.();
    },
    resetValues: () => {
      _.values = cloneDeep(_.defaultValues);
      for (const key in _.registered) {
        const value = _.values[key];
        const type = _.schema[key].type;
        _.registered[key].control.setValue?.(
          value ?? (type === "checkbox" ? [] : "")
        );
      }
    },
    clearValues: () => {
      _.values = {};
      for (const key in _.registered) {
        const value = _.values[key];
        const type = _.schema[key].type;
        _.registered[key].control.setValue?.(
          value ?? (type === "checkbox" ? [] : "")
        );
      }
    },
    setEditable: (...params) => {
      if (params.length === 1) {
        Object.values(_.schema).forEach((item) => {
          item.editable = params[0];
        });
      } else if (params.length === 2) {
        _.schema[params[0]] = params[1];
      }
      forceUpdate();
    },
    setSchema: (name, value) => {
      _.schema[name] = cloneDeep(
        typeof value === "function" ? value(cloneDeep(_.schema[name])) : value
      );
      forceUpdate();
    },
    validate: () => {
      const errors = {};
      for (const key in _.schema) {
        const error = {};
        const value = _.values[key];
        const { required, validate, minLength, maxLength, min, max } =
          _.schema[key];
        if (required === true) {
          if (!value) {
            error["required"] = {
              errorMessage: "An error occurred (required)",
            };
          }
        }
        if (typeof validate === "function") {
          if (!validate(cloneDeep(value))) {
            error["validate"] = {
              errorMessage: "An error occurred (validate)",
            };
          }
        }
        if (typeof minLength === "number") {
          if (value.length < minLength) {
            error["minLength"] = {
              errorMessage: "An error occurred (minLength)",
            };
          }
        }
        if (typeof maxLength === "number") {
          if (value.length > maxLength) {
            error["maxLength"] = {
              errorMessage: "An error occurred (maxLength)",
            };
          }
        }
        if (typeof min === "number") {
          if (value < min) {
            error["min"] = { errorMessage: "An error occurred (min)" };
          }
        }
        if (typeof max === "number") {
          if (value < max) {
            error["max"] = { errorMessage: "An error occurred (max)" };
          }
        }
        if (Object.keys(error).length) {
          errors[key] = error;
        }
      }
      _.errors = errors;
      forceUpdate();
    },
    TESTGET: () => {
      console.log(_);
    },
  }).current;

  return { ...methods };
};

export { useForm };
