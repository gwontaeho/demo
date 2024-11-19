import { useRef, useState } from "react";

const useForm = (arg = {}) => {
  const { defaultSchema } = arg;

  const $ = useRef({
    defaultSchema,
    refs: {},
    schema: {},
    values: {},
    errors: {},
    watches: {},
    validations: {},
    valuesSetter: null,
    itemValueSetters: {},
    itemSchemaSetters: {},
    itemErrorSetters: {},
  });

  const [values, setValues] = useState(() => {
    return Object.fromEntries(
      Object.entries(defaultSchema).map(([name, item]) => {
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
        $.current.values[name] = value;

        return [name, value];
      })
    );
  });
  if ($.current.valuesSetter !== setValues) {
    $.current.valuesSetter = setValues;
  }

  console.log($);

  const [schema, setSchema] = useState(() => {
    $.current.validations = Object.fromEntries(
      Object.entries(defaultSchema).map(([name, item]) => {
        const { required, validate, minLength, maxLength, min, max } = item;
        return [name, { required, validate, minLength, maxLength, min, max }];
      })
    );

    $.current.schema = Object.fromEntries(
      Object.entries(defaultSchema).map(([name, item]) => {
        const { edit = true, type } = item;
        return [name, { edit, type }];
      })
    );

    return Object.fromEntries(
      Object.entries(defaultSchema).map(([name, item]) => {
        const {
          type,
          defaultValue,
          validate,
          minLength,
          maxLength,
          min,
          max,
          ...rest
        } = item;
        return [name, { name, $useForm: $.current, ...rest }];
      })
    );
  });

  const setValue = (name, value) => {
    $.current.values[name] = value;
    $.current.itemValueSetters[name]?.(value);
    if ($.current.watches[name] === true) {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setEdit = (name, value) => {
    $.current.schema[name].edit = value;
    $.current.itemSchemaSetters[name]?.((prev) => {
      return { ...prev, edit: value };
    });
  };

  const getValues = () => {
    return $.current.values;
  };

  const watch = (name) => {
    $.current.watches[name] = true;
    return $.current.values[name];
  };

  const clearValues = () => {
    for (const name in $.current.values) {
      const value = $.current.schema[name]?.type === "checkbox" ? [] : "";
      $.current.values[name] = value;
      $.current.itemValueSetters[name]?.(value);
    }
  };

  const clearErrors = () => {
    $.current.errors = {};
    for (const name in $.current.itemErrorSetters) {
      $.current.itemErrorSetters[name](null);
    }
  };

  const validate = () => {
    $.current.errors = Object.fromEntries(
      Object.entries($.current.values)
        .map(([name, value]) => {
          let error = {};
          if ($.current.validations[name]) {
            const { required, validate, minLength, maxLength, min, max } =
              $.current.validations[name];
            if (required !== undefined) {
              if (Array.isArray(value) ? value.length === 0 : !value) {
                error["required"] = { message: "An error occurred (required)" };
              }
            }
            if (validate !== undefined) {
              if (!validate(value)) {
                error["validate"] = { message: "An error occurred (validate)" };
              }
            }
            if (minLength !== undefined) {
              if (minLength > value.length) {
                error["minLength"] = {
                  message: "An error occurred (minLength)",
                };
              }
            }
            if (maxLength !== undefined) {
              if (maxLength < value.length) {
                error["maxLength"] = {
                  message: "An error occurred (maxLength)",
                };
              }
            }
            if (min !== undefined) {
              if (min > value) {
                error["min"] = { message: "An error occurred (min)" };
              }
            }
            if (max !== undefined) {
              if (max < value) {
                error["max"] = { message: "An error occurred (max)" };
              }
            }
          }
          $.current.itemErrorSetters[name]?.(
            Object.keys(error).length ? error : null
          );
          return [name, error];
        })
        .filter(([, error]) => Object.keys(error).length !== 0)
    );
    return !Object.keys($.current.errors).length;
  };

  return {
    schema,
    watch,
    getValues,
    setValue,
    setEdit,
    validate,
    clearValues,
    clearErrors,
  };
};

const useControl = (arg = {}) => {
  const { $useForm, name, ...rest } = arg;
  if (!$useForm) return arg;

  try {
    const [schema, setSchema] = useState($useForm.schema[name] || {});
    if ($useForm.itemSchemaSetters[name] !== setSchema) {
      $useForm.itemSchemaSetters[name] = setSchema;
    }

    const [value, setValue] = useState($useForm.values[name] || "");
    if ($useForm.itemValueSetters[name] !== setValue) {
      $useForm.itemValueSetters[name] = setValue;
    }

    const [error, setError] = useState(null);
    if ($useForm.itemErrorSetters[name] !== setError) {
      $useForm.itemErrorSetters[name] = setError;
    }

    return {
      error,
      name,
      value,
      ref: (ref) => {
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
      },
      onChange: (event) => {
        let nextValue;
        switch (schema.type) {
          case "checkbox":
            nextValue = $useForm.values[name] || [];
            if (event.target.checked)
              nextValue = [...nextValue, event.target.value];
            else
              nextValue = nextValue.filter(
                (item) => item !== event.target.value
              );
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
        setValue(nextValue);
        if ($useForm.watches[name] === true) {
          $useForm.valuesSetter((prev) => ({ ...prev, [name]: nextValue }));
        }
      },
      ...schema,
      ...rest,
    };
  } catch (error) {
    return {};
  }
};

export { useForm, useControl };
