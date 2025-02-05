const getAuthorization = () => {
  return `Bearer Token`;
};

const makeRequest = (method, authentication) => {
  return async (...args) => {
    const hasBody = method === "GET" || method === "DELETE" ? false : true;
    const config = { ...(hasBody ? args[2] : args[1]), method };
    if (authentication) {
      config.headers = { ...config.headers, Authorization: getAuthorization() };
    }
    if (hasBody) {
      const body = args[1];
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
      } else if (contentType.includes("text")) {
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
  get: makeRequest("GET"),
  post: makeRequest("POST"),
  put: makeRequest("PUT"),
  patch: makeRequest("PATCH"),
  delete: makeRequest("DELETE"),
};

const authenticated = {
  get: makeRequest("GET", true),
  post: makeRequest("POST", true),
  put: makeRequest("PUT", true),
  patch: makeRequest("PATCH", true),
  delete: makeRequest("DELETE", true),
};

const authenticate = (arg) => {
  return arg ? authenticated : unauthenticated;
};

const api = {};

api.get = unauthenticated.get;
api.post = unauthenticated.post;
api.put = unauthenticated.put;

api.authenticate = authenticate;

export { api };
