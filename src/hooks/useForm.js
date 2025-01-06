import { useCallback, useEffect, useReducer, useRef, useState } from "react";

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
    controls: {},
    errors: {},
    watches: {},
    render: () => setRenderCount((prev) => ++prev),
    schema: createSchema(defaultSchema),
    values: createValues(defaultSchema),
    validations: createValidations(defaultSchema),
  });

  // 스키마 생성
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
    const nextSchema = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.schema[name]))
        : value
    );
    if (typeof nextSchema !== "object") return;

    const render =
      $.current.watches[name]?.schema === true ||
      ("label" in nextSchema &&
        nextSchema.label !== $.current.schema[name].label) ||
      ("required" in nextSchema &&
        nextSchema.required !== $.current.schema[name].required);

    $.current.schema[name] = replace
      ? nextSchema
      : { ...$.current.schema[name], ...nextSchema };

    $.current.validations[name] = createValidation($.current.schema[name]);

    if ($.current.controls[name]?.length) {
      $.current.controls[name].forEach(({ dispatch }) => {
        dispatch({ type: "SET_SCHEMA", payload: $.current.schema[name] });
      });
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

      const nextSchema = cloneDeep(
        value instanceof Function
          ? value(cloneDeep($.current.schema[name]))
          : value
      );
      if (typeof nextSchema !== "object") continue;

      render =
        render ||
        $.current.watches[name]?.schema === true ||
        ("label" in nextSchema &&
          nextSchema.label !== $.current.schema[name].label) ||
        ("required" in nextSchema &&
          nextSchema.required !== $.current.schema[name].required);

      $.current.schema[name] = replace
        ? nextSchema
        : { ...$.current.schema[name], ...nextSchema };

      $.current.validations[name] = createValidation($.current.schema[name]);

      if ($.current.controls[name]?.length) {
        $.current.controls[name].forEach(({ dispatch }) => {
          dispatch({
            type: "SET_SCHEMA",
            payload: $.current.schema[name],
          });
        });
      }
    }

    if (render) {
      $.current.render();
    }
  };

  const setEdit = (name, value) => {
    let render = false;

    const targets =
      value === undefined ? Object.keys($.current.schema) : [name];

    for (const target of targets) {
      $.current.schema[target] = {
        ...$.current.schema[target],
        edit: Boolean(value === undefined ? name : value),
      };

      if ($.current.controls[target]?.length) {
        $.current.controls[target].forEach(({ dispatch }) => {
          dispatch({
            type: "SET_SCHEMA",
            payload: $.current.schema[target],
          });
        });
      }

      render = render || $.current.watches[name]?.schema === true;
    }

    if (render) {
      $.current.render();
    }
  };

  const setValue = (name, value) => {
    const nextValue = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.values[name]))
        : value
    );

    $.current.values[name] = nextValue;

    if ($.current.controls[name]?.length) {
      $.current.controls[name].forEach(({ dispatch }) => {
        dispatch({
          type: "SET_VALUE",
          payload: $.current.values[name],
        });
      });
    }

    const render = $.current.watches[name]?.value === true;

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

      if ($.current.controls[name]?.length) {
        $.current.controls[name].forEach(({ dispatch }) => {
          dispatch({
            type: "SET_VALUE",
            payload: $.current.values[name],
          });
        });
      }

      render = render || $.current.watches[name]?.value === true;
    }

    if (render) {
      $.current.render();
    }
  };

  const setFocus = (name) => {
    console.log($.current.controls[name]);
    $.current.controls[name]?.[0]?.ref?.focus?.();
  };

  const resetValues = () => {};

  const getValue = (name) => {
    return cloneDeep($.current.values[name]);
  };

  const getValues = () => {
    return cloneDeep($.current.values);
  };

  const getSchema = (name) => {
    return cloneDeep($.current.schema[name]);
  };

  const getSchemas = () => {
    return cloneDeep($.current.schema);
  };

  const getError = (name) => {
    return cloneDeep($.current.errors[name]) || null;
  };

  const getErrors = () => {
    return cloneDeep($.current.errors);
  };

  const watchValue = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name].value = true;
    return $.current.values[name];
  };

  const watchSchema = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name].schema = true;
    return cloneDeep($.current.schema[name]);
  };

  const watchError = (name) => {
    if (!$.current.watches[name]) {
      $.current.watches[name] = {};
    }
    $.current.watches[name].error = true;
    return cloneDeep($.current.errors[name]) || null;
  };

  const clearErrors = () => {
    let render = false;
    $.current.errors = {};
    for (const name in $.current.controls) {
      if ($.current.controls[name]?.length) {
        $.current.controls[name].forEach(({ dispatch }) => {
          dispatch({ type: "SET_ERROR", payload: null });
        });
      }
      render = render || $.current.watches[name]?.error === true;
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
      if ($.current.controls[name]?.length) {
        $.current.controls[name].forEach(({ dispatch }) => {
          dispatch({
            type: "SET_ERROR",
            payload: $.current.errors[name] || null,
          });
        });
      }
      render = render || $.current.watches[name]?.error === true;
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
  try {
    const { $useForm, name, ...rest } = params;
    if (!$useForm) {
      throw new Error();
    }

    const $ = useRef({ ref: null, dispatch: null });
    const [state, dispatch] = useReducer(reducer, params, createInitialState);

    const ref = (ref) => {
      if (!ref) return;
      switch (schema.type) {
        case "radio":
        case "checkbox": {
          if (!($.current.ref || []).find((item) => item === ref)) {
            $.current.ref = [...($.ref || []), ref];
          }
          break;
        }
        default: {
          $.current.ref = ref;
        }
      }
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
      $useForm.controls[name].forEach(({ dispatch }) => {
        dispatch({ type: "SET_VALUE", payload: () => nextValue });
      });
      if ($useForm.watches[name]?.value === true) {
        $useForm.render();
      }
    };

    useEffect(() => {
      $.current.dispatch = dispatch;
      if (!$useForm.controls[name]) {
        $useForm.controls[name] = [];
      }
      $useForm.controls[name].push($.current);
      return () => {
        $useForm.controls[name].splice(
          $useForm.controls[name].findIndex((item) => item === $.current)
        );
      };
    }, []);

    const { schema, value, error } = state;

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
    return params;
  }
};

export { useForm, useControl };
