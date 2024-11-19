export const api = {};

const getAuthorization = () => {
  return `Bearer Token`;
};

const createRequest = (method, authentication) => {
  return async (...args) => {
    let methodType;
    switch (method) {
      case "GET":
      case "DELETE":
        methodType = 0;
        break;
      case "POST":
      case "PUT":
      case "PATCH":
        methodType = 1;
        break;
    }

    let config;
    if (methodType === 0) {
      config = { ...args[1] };
    } else if (methodType === 1) {
      config = { ...args[2] };
    }

    config.method = method;
    if (authentication) {
      config.headers = {
        ...config.headers,
        Authorization: getAuthorization(),
      };
    }

    if (methodType === 1 && args[1]) {
      let body = args[1];
      switch (Object.prototype.toString.call(body)) {
        case "[object Object]":
        case "[object Array]":
          body = JSON.stringify(body);
          config.headers = {
            ...config.headers,
            "Content-Type": "application/json",
          };
          break;
      }

      config.body = body;
    }

    try {
      const response = await window.fetch(args[0], config);
      const contentType = response.headers.get("Content-Type") || "";

      let data;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else if (contentType.includes("text/")) {
        data = await response.text();
      }

      return {
        data,
        response,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.log(error);
    }
  };
};

const unauthenticated = {
  get: createRequest("GET"),
  post: createRequest("POST"),
  put: createRequest("PUT"),
  patch: createRequest("PATCH"),
  delete: createRequest("DELETE"),
};

const authenticated = {
  get: createRequest("GET", true),
  post: createRequest("POST", true),
  put: createRequest("PUT", true),
  patch: createRequest("PATCH", true),
  delete: createRequest("DELETE", true),
};

const authenticate = (arg) => {
  return arg ? authenticated : unauthenticated;
};

api.get = unauthenticated.get;
api.post = unauthenticated.post;
api.put = unauthenticated.put;
api.authenticate = authenticate;
