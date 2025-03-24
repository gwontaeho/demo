import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";

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
  const _useForm = useRef(null);
  _useForm.current ??= new (class {
    #refs = {};
    #errors = {};
    #schema = cloneDeep(defaultSchema);
    #values = cloneDeep(defaultValues);
    #defaultValues = cloneDeep(defaultValues);
    #renders = {};

    #render = (name) => {
      name
        ? this.#renders[name] &&
          this.#renders[name].forEach((render) => render())
        : Object.values(this.#renders).forEach((item) => {
            item.forEach((render) => render());
          });
    };

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

    #initialize = (name, forceUpdate) => {
      this.#renders[name] ??= [];
      this.#renders[name].includes(forceUpdate) ||
        this.#renders[name].push(forceUpdate);
      return {
        ref: (ref) => {
          this.#isHTMLElement(ref) &&
            this.#refs[name] !== ref &&
            (this.#refs[name] = ref);
        },
        onChange: (event) => {
          if (this.#isHTMLElement(event?.target)) {
            if (this.#isCheckbox(event.target)) {
              Array.isArray(this.#values[name]) || (this.#values[name] = []);
              event.target.checked
                ? this.#values[name].push(event.target.value)
                : this.#values[name].splice(
                    this.#values[name].findIndex(
                      (item) => item === event.target.value
                    ),
                    1
                  );
            } else {
              this.#values[name] = event.target.value;
            }
          } else {
            this.#values[name] = event;
          }
          this.#render(name);
        },
        get: () => {
          return {
            value: this.#values[name],
            ...this.#schema[name],
            ...(this.#errors[name] && {
              errorMessage: Object.values(this.#errors[name])[0].message,
            }),
          };
        },
        // uninitialize: () => {
        //   this.#renders[name].splice(
        //     this.#renders[name].findIndex((item) => item === forceUpdate),
        //     1
        //   );
        // },
      };
    };

    register = (name) => {
      return { name, initialize: this.#initialize };
    };

    setSchema = (name, value) => {
      this.#schema[name] = cloneDeep(
        typeof value === "function"
          ? value(cloneDeep(this.#schema[name]))
          : value
      );
      this.#render(name);
    };

    setValue = (name, value) => {
      this.#values[name] = cloneDeep(value);
      this.#render(name);
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
          this.#schema[key];
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

    getValue = (name) => {
      const values = cloneDeep(this.#values);
      return name ? values[name] : values;
    };

    getError = (name) => {
      const errors = cloneDeep(this.#errors);
      return name ? errors[name] : errors;
    };

    clearValue = () => {};

    resetValue = () => {
      this.#values = cloneDeep(this.#defaultValues);
      this.#render();
    };

    setEditable = (name, value) => {
      if (value === undefined) {
        for (const key in this.#schema) {
          this.#schema[key].editable = name;
        }
        this.#render();
      } else {
        this.#schema[name] = value;
        this.#render(name);
      }
    };

    getLabel = () => {};
  })();

  return { ..._useForm.current };
};

const useControl = (props) => {
  const { name, initialize, ...rest } = props;
  const forceUpdate = useReducer(() => ({}))[1];
  const _useControl = useRef(null);
  typeof initialize === "function" &&
    (_useControl.current ??= initialize(name, forceUpdate));

  if (_useControl.current === null) {
    return props;
  } else {
    const { ref, onChange, get } = _useControl.current;
    return { ref, onChange, ...get(), ...rest };
  }
};

export { useForm, useControl };
