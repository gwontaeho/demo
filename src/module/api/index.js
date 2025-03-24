const getToken = () => {
  return `Bearer Token`;
};

const makeRequest = (method, auth) => {
  return async (url, bodyOrConfig, config) => {
    let token;
    if (auth) {
      // 토큰 확인 추가해야함
      token = getToken();
    }

    const isBodyAllowed =
      method === "POST" || method === "PUT" || method === "PATCH";
    const rawConfig = isBodyAllowed ? config : bodyOrConfig;
    const rawBody = isBodyAllowed ? bodyOrConfig : undefined;
    const newConfig = { ...rawConfig, method };

    if (token) {
      newConfig.headers[Authorization] = token;
    }

    if (isBodyAllowed) {
      switch (Object.prototype.toString.call(rawBody)) {
        case "[object Object]":
        case "[object Array]":
          body = JSON.stringify(body);
          newConfig.headers["Content-Type"] = "application/json";
          break;
        default:
          body = rawBody;
          break;
      }
      newConfig.body = body;
    }

    try {
      const response = await window.fetch(url, config);
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

const requestObject = {
  get: makeRequest("GET"),
  post: makeRequest("POST"),
  put: makeRequest("PUT"),
  patch: makeRequest("PATCH"),
  delete: makeRequest("DELETE"),
};

const withAuth = {
  get: makeRequest("GET", true),
  post: makeRequest("POST", true),
  put: makeRequest("PUT", true),
  patch: makeRequest("PATCH", true),
  delete: makeRequest("DELETE", true),
};

const auth = (param = true) => {
  return { ...(param ? withAuth : requestObject) };
};

const api = { ...requestObject, auth };

export { api };
