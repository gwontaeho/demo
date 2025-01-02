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

const createSchema = (schema) => {
  return Object.fromEntries(
    Object.entries(schema).map(([name, item]) => {
      const { edit = true, ...rest } = item;
      return [name, { ...rest, name, edit }];
    })
  );
};

const createValues = (schema) => {
  return Object.fromEntries(
    Object.entries(schema).map(([name, item]) => {
      const { defaultValue } = item;
      let value;
      switch (item.type) {
        case "checkbox":
          value = defaultValue || [];
          break;
        case "date":
          value = defaultValue || null;
          break;
        default:
          value = defaultValue || "";
      }
      return [name, value];
    })
  );
};

const createValidation = (schema) => {
  const { required, validate, minLength, maxLength, min, max } = schema;
  return { required, validate, minLength, maxLength, min, max };
};

const createValidations = (schema) => {
  return Object.fromEntries(
    Object.entries(schema).map(([name, item]) => {
      return [name, createValidation(item)];
    })
  );
};

const useForm = (params = {}) => {
  const { defaultSchema } = params;

  const [renderCount, setRenderCount] = useState(0);

  const $ = useRef({
    defaultSchema,
    refs: {},
    errors: {},
    watches: {},
    setters: {},
    render: () => setRenderCount((prev) => ++prev),
    schema: createSchema(defaultSchema),
    values: createValues(defaultSchema),
    validations: createValidations(defaultSchema),
  });

  const schema = Object.fromEntries(
    Object.entries($.current.schema).map(([name, item]) => {
      const { label, required } = item;
      return [
        name,
        {
          name,
          ...(label && { label }),
          ...(required && { required }),
          $useForm: $.current,
        },
      ];
    })
  );

  const setSchema = (name, value, replace) => {
    const nextSchema =
      value instanceof Function ? value({ ...$.current.schema[name] }) : value;
    if (typeof nextSchema !== "object") return;
    let render = false;
    const prevLabel = $.current.schema[name].label;
    const prevRequired = $.current.schema[name].required;
    if (replace) {
      $.current.schema[name] = nextSchema;
    } else {
      $.current.schema[name] = { ...$.current.schema[name], ...nextSchema };
    }
    $.current.setters[name]?.({
      type: "SET_SCHEMA",
      payload: $.current.schema[name],
    });
    $.current.validations[name] = createValidation($.current.schema[name]);
    if (
      ("label" in nextSchema && nextSchema.label !== prevLabel) ||
      ("required" in nextSchema && nextSchema.required !== prevRequired) ||
      $.current.watches[name]?.schema === true
    ) {
      render = true;
    }
    if (render) {
      $.current.render();
    }
  };

  const setSchemas = (values, replace) => {
    if (typeof values !== "object") return;
    let render = false;
    for (const name in values) {
      const value = values[name];
      const nextSchema =
        value instanceof Function
          ? value({ ...$.current.schema[name] })
          : value;
      if (typeof nextSchema !== "object") continue;
      const prevLabel = $.current.schema[name].label;
      const prevRequired = $.current.schema[name].required;
      if (replace) {
        $.current.schema[name] = nextSchema;
      } else {
        $.current.schema[name] = {
          ...$.current.schema[name],
          ...nextSchema,
        };
      }
      $.current.setters[name]?.({
        type: "SET_SCHEMA",
        payload: $.current.schema[name],
      });
      $.current.validations[name] = createValidation($.current.schema[name]);
      if (
        render === false &&
        (("label" in nextSchema && nextSchema.label !== prevLabel) ||
          ("required" in nextSchema && nextSchema.required !== prevRequired) ||
          $.current.watches[name]?.schema === true)
      ) {
        render = true;
      }
    }
    if (render) {
      $.current.render();
    }
  };

  const setEdit = (name, value) => {
    const setEditByName = (targetName, nextValue) => {
      $.current.schema[targetName] = {
        ...$.current.schema[targetName],
        edit: nextValue,
      };
      $.current.setters[targetName]?.({
        type: "SET_SCHEMA",
        payload: $.current.schema[targetName],
      });
    };

    let render = false;
    if (value === undefined) {
      const nextValue = Boolean(name);
      for (const name in $.current.schema) {
        setEditByName(name, nextValue);
        if (render === false && $.current.watches[name]?.schema === true) {
          render = true;
        }
      }
    } else {
      const nextValue = Boolean(value);
      setEditByName(name, nextValue);
      if ($.current.watches[name]?.schema === true) {
        render = true;
      }
    }
    if (render) {
      $.current.render();
    }
  };

  const setValue = (name, value) => {
    let render = false;
    const nextValue =
      value instanceof Function ? value(clone($.current.values[name])) : value;
    $.current.values[name] = nextValue;
    $.current.setters[name]?.({
      type: "SET_VALUE",
      payload: $.current.values[name],
    });
    if ($.current.watches[name]?.value === true) {
      render = true;
    }
    if (render) {
      $.current.render();
    }
  };

  const clearValues = () => {
    let render = false;
    for (const name in $.current.values) {
      const type = $.current.schema[name].type;
      const nextValue = type === "checkbox" ? [] : type === "date" ? null : "";
      $.current.values[name] = nextValue;
      $.current.setters[name]?.({
        type: "SET_VALUE",
        payload: $.current.values[name],
      });
      if (render === false && $.current.watches[name]?.value === true) {
        render = true;
      }
    }
    if (render) {
      $.current.render();
    }
  };

  const setFocus = (name) => {
    $.current.refs[name]?.focus?.();
  };

  const resetValues = () => {};

  const getValue = (name) => {
    return $.current.values[name];
  };

  const getValues = () => {
    return $.current.values;
  };

  const getSchema = (name) => {
    return $.current.schema[name];
  };

  const getSchemas = () => {
    return $.current.schema;
  };

  const getError = (name) => {
    return $.current.errors[name] || null;
  };

  const getErrors = () => {
    return $.current.errors;
  };

  const watchValue = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name] = { ...$.current.watches[name], value: true };
    return $.current.values[name];
  };

  const watchSchema = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name] = { ...$.current.watches[name], schema: true };
    return $.current.schema[name];
  };

  const watchError = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name] = { ...$.current.watches[name], error: true };
    return $.current.errors[name] || null;
  };

  const clearErrors = () => {
    let render = false;
    $.current.errors = {};
    for (const name in $.current.setters) {
      $.current.setters[name]?.({ type: "SET_ERROR", payload: null });
      if (render === false && $.current.watches[name]?.error === true) {
        render = true;
      }
    }
    if (render) {
      $.current.render();
    }
  };

  const validate = () => {
    let render = false;
    for (const name in $.current.values) {
      if (!$.current.validations[name]) continue;
      const value = $.current.values[name];
      let error = {};
      const { required, validate, minLength, maxLength, min, max } =
        $.current.validations[name];
      if (required === true) {
        if (Array.isArray(value) ? value.length === 0 : !value) {
          error["required"] = { message: "An error occurred (required)" };
        }
      }
      if (validate instanceof Function) {
        if (validate(value) === false) {
          error["validate"] = { message: "An error occurred (validate)" };
        }
      }
      if (typeof minLength === "number") {
        if (minLength > value.length) {
          error["minLength"] = {
            message: "An error occurred (minLength)",
          };
        }
      }
      if (typeof maxLength === "number") {
        if (maxLength < value.length) {
          error["maxLength"] = {
            message: "An error occurred (maxLength)",
          };
        }
      }
      if (typeof min === "number") {
        if (min > value) {
          error["min"] = { message: "An error occurred (min)" };
        }
      }
      if (typeof max === "number") {
        if (max < value) {
          error["max"] = { message: "An error occurred (max)" };
        }
      }
      if (Object.keys(error).length) {
        $.current.errors[name] = error;
      } else {
        delete $.current.errors[name];
      }
      $.current.setters[name]?.({
        type: "SET_ERROR",
        payload: $.current.errors[name] || null,
      });
      if (render === false && $.current.watches[name]?.error === true) {
        render = true;
      }
    }
    if (render) {
      $.current.render();
    }
    return !Object.keys($.current.errors).length;
  };

  return {
    schema,
    setFocus,
    watchValue,
    watchSchema,
    watchError,
    getValue,
    getValues,
    getSchema,
    getSchemas,
    getError,
    getErrors,
    setValue,
    setSchema,
    setSchemas,
    setEdit,
    validate,
    clearValues,
    clearErrors,
  };
};

const removeFormProperty = (params) => {
  const {
    defaultValue,
    label,
    required,
    validate,
    minLength,
    min,
    max,
    ...rest
  } = params;
  return rest;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SCHEMA":
      return {
        ...state,
        schema:
          action.payload instanceof Function
            ? action.payload(state.schema)
            : action.payload,
      };
    case "SET_VALUE":
      return {
        ...state,
        value:
          action.payload instanceof Function
            ? action.payload(state.value)
            : action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error:
          action.payload instanceof Function
            ? action.payload(state.error)
            : action.payload,
      };
  }
};

const createInitialState = ({ $useForm, name }) => {
  return {
    schema: $useForm.schema[name] || {},
    value: $useForm.values[name] || "",
    error: null,
  };
};

const useControl = (params = {}) => {
  const { $useForm, name, ...rest } = params;
  if (!$useForm) return params;

  try {
    const [state, dispatch] = useReducer(reducer, params, createInitialState);
    $useForm.setters[name] = dispatch;
    useEffect(() => {
      return () => {
        delete $useForm.setters[name];
      };
    }, []);
    const { schema, value, error } = state;

    const ref = (ref) => {
      if (ref) {
        switch (schema.type) {
          case "radio":
          case "checkbox": {
            const prevRef = $useForm.refs[name] || [];
            if (!prevRef.find((item) => item === ref)) {
              $useForm.refs[name] = [...prevRef, ref];
            }
            break;
          }
          default: {
            if ($useForm.refs[name] !== ref) {
              $useForm.refs[name] = ref;
            }
          }
        }
      }
      // ref 지우기
    };
    const onChange = (event) => {
      let nextValue;
      switch (schema.type) {
        case "checkbox":
          nextValue = $useForm.values[name] || [];
          if (event.target.checked)
            nextValue = [...nextValue, event.target.value];
          else
            nextValue = nextValue.filter((item) => item !== event.target.value);
          break;
        case "date":
          if (event instanceof Date || event === null) nextValue = event;
          else nextValue = event.target.value;
          break;
        default:
          nextValue = event.target.value;
          break;
      }
      $useForm.values[name] = nextValue;
      dispatch({ type: "SET_VALUE", payload: () => nextValue });
      if ($useForm.watches[name]?.value === true) {
        $useForm.render();
      }
    };
    return {
      error,
      name,
      value,
      ref,
      onChange,
      ...removeFormProperty(schema),
      ...rest,
    };
  } catch (error) {
    return {};
  }
};

export { useForm, useControl };
