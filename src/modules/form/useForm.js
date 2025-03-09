import { useEffect, useReducer, useRef, useState } from "react";

const clone = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return [...item];
  }
  return { ...item };
};

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

const useForm = (params = {}) => {
  const { defaultSchema, defaultValues = {} } = params;
  const forceUpdate = useReducer(() => ({}))[1];
  const _useForm = useRef(null);
  if (_useForm.current === null) {
    _useForm.current = new (class {
      #refs = {};
      #errors = {};
      #schema = cloneDeep(defaultSchema);
      #values = cloneDeep(defaultValues);
      #render = forceUpdate;

      #isHTMLElement = (param) => {
        return param instanceof HTMLElement;
      };

      #isRadio = (param) => {
        return (
          param instanceof HTMLElement &&
          param.tagName === "INPUT" &&
          param.type === "radio"
        );
      };

      #isCheckbox = (param) => {
        return (
          param instanceof HTMLElement &&
          param.tagName === "INPUT" &&
          param.type === "checkbox"
        );
      };

      #ref = (ref, name) => {
        if (this.#isHTMLElement(ref)) {
          if (this.#isRadio(ref) || this.#isCheckbox(ref)) {
            if (!Array.isArray(this.#refs[name])) {
              this.#refs[name] = [];
            }
            if (!this.#refs[name].includes(ref)) {
              this.#refs[name].push(ref);
            }
            if (this.#isRadio(ref)) {
              if (this.#values[name] === ref.value) {
                ref.checked = true;
              }
            }
            if (this.#isCheckbox(ref)) {
              if (
                Array.isArray(this.#values[name]) &&
                this.#values[name].includes(ref.value)
              ) {
                ref.checked = true;
              }
            }
          } else {
            if (this.#refs[name] !== ref) {
              this.#refs[name] = ref;

              if (this.#values[name]) {
                ref.value = this.#values[name];
              }
            }
          }
        }
      };

      #onChange = (event, name) => {
        if (this.#isHTMLElement(event?.target)) {
          if (this.#isCheckbox(event.target)) {
            if (!Array.isArray(this.#values[name])) {
              this.#values[name] = [];
            }
            if (event.target.checked) {
              this.#values[name].push(event.target.value);
            } else {
              this.#values[name].splice(
                this.#values[name].findIndex(
                  (item) => item === event.target.value
                ),
                1
              );
            }
          } else {
            this.#values[name] = event.target.value;
          }
        } else {
          this.#values[name] = event;
        }
      };

      #getValidation = (schema) => {
        const { required, validate, minLength, maxLength, min, max } = schema;
        return { required, validate, minLength, maxLength, min, max };
      };

      register = (name, params) => {
        const obj = {};
        obj.name = name;
        obj.ref = (ref) => this.#ref(ref, name);
        obj.onChange = (event) => this.#onChange(event, name);
        if (this.#schema[name]) Object.assign(obj, this.#schema[name]);
        return obj;
      };

      setSchema = (name, value) => {
        this.#schema[name] = cloneDeep(
          typeof value === "function"
            ? value(cloneDeep(this.#schema[name]))
            : value
        );
        this.#render();
      };

      setValue = (name, value) => {
        this.#values[name] = cloneDeep(value);
        if (this.#refs[name]) {
          if (Array.isArray(this.#refs[name])) {
            this.#refs[name].forEach((item) => {
              if (this.#isCheckbox(item)) {
                if (Array.isArray(value)) {
                  item.checked = value.includes(item.value);
                }
              }
              if (this.#isRadio(item)) {
                item.checked = item.value === value;
              }
            });
          } else {
            this.#refs[name].value = value;
          }
        }
      };

      setFocus = (name) => {
        this.#refs[name]?.focus?.();
      };

      validate = () => {
        const errors = {};
        for (const key in this.#schema) {
          const error = {};
          const value = this.#values[key];
          const { required, validate, minLength, maxLength, min, max } =
            this.#getValidation(this.#schema[key]);
          if (required === true) {
            if (!value) {
              error["required"] = { message: "An error occurred (required)" };
            }
          }
          if (typeof validate === "function") {
            if (!validate(cloneDeep(value))) {
              error["validate"] = { message: "An error occurred (validate)" };
            }
          }
          if (typeof minLength === "number") {
            if (value.length < minLength) {
              error["minLength"] = { message: "An error occurred (minLength)" };
            }
          }
          if (typeof maxLength === "number") {
            if (value.length > maxLength) {
              error["maxLength"] = { message: "An error occurred (maxLength)" };
            }
          }
          if (typeof min === "number") {
            if (value < min) {
              error["min"] = { message: "An error occurred (min)" };
            }
          }
          if (typeof max === "number") {
            if (value < max) {
              error["max"] = { message: "An error occurred (max)" };
            }
          }
          if (Object.keys(error).length) {
            errors[key] = error;
          }
        }
        this.#errors = errors;
        this.#render();
      };

      getValues = (name) => {
        const values = cloneDeep(this.#values);
        return name ? values[name] : values;
      };

      getErrors = (name) => {
        const errors = cloneDeep(this.#errors);
        return name ? errors[name] : errors;
      };

      setEditable = (name, value) => {
        if (value === undefined) {
          for (const key in this.#schema) {
            this.#schema[key].editable = name;
          }
        } else {
          this.#schema[name] = value;
        }
      };

      test = () => {
        console.log(this.#schema);
      };
    })();
  }

  return { ..._useForm.current };
};

export { useForm };
