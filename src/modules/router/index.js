import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useReducer,
} from "react";

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

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const RouterContext = createContext();
const RouterStateContext = createContext();

const RouterStateProvider = ({ children }) => {
  const _router = useContext(RouterContext);
  const forceUpdate = useReducer(() => ({}), {})[1];
  _router.initialize(forceUpdate);
  return (
    <RouterStateContext.Provider value={{}}>
      {children}
    </RouterStateContext.Provider>
  );
};

const RouterProvider = ({ children }) => {
  const _router = useRef(
    new (class {
      #params = {};
      #renderRouter = null;
      #onPopstate = null;

      initialize = (forceUpdate) => {
        if (this.#renderRouter !== forceUpdate) {
          this.#renderRouter = forceUpdate;
          if (this.#onPopstate) {
            window.removeEventListener("popstate", this.#onPopstate);
          }
          this.#onPopstate = () => {
            this.setParams({});
            this.#renderRouter();
          };
          window.addEventListener("popstate", this.#onPopstate);
        }
      };

      getLocation = () => {
        return cloneDeep({
          pathname: window.location.pathname,
          params: this.#params,
          searchParams: Object.fromEntries(
            new URLSearchParams(window.location.search).entries()
          ),
        });
      };

      setParams = (params) => {
        this.#params = params;
      };

      navigate = (to) => {
        window.history.pushState({}, "", to);
        this.#onPopstate();
      };
    })()
  ).current;

  return (
    <RouterContext.Provider value={_router}>
      <RouterStateProvider>{children}</RouterStateProvider>
    </RouterContext.Provider>
  );
};

const useNavigate = () => {
  const _router = useContext(RouterContext);
  return _router.navigate;
};

const useLocation = () => {
  useContext(RouterStateContext);
  const _router = useContext(RouterContext);
  return _router.getLocation();
};

const Routes = ({ children }) => {
  useContext(RouterStateContext);
  const _router = useContext(RouterContext);
  const location = _router.getLocation();

  const child = children.find((child) => {
    const { path } = child.props;
    const pathname = location.pathname;

    if (path === pathname) {
      return true;
    }

    const ps = path.split("/");
    const pns = pathname.split("/");

    if (ps.length === pns.length) {
      const params = {};
      for (let i = 0; i < ps.length; i++) {
        if (ps[i] !== pns[i]) {
          if (ps.length - 1 === i && ps[i] === "*") {
            continue;
          } else if (!ps[i].startsWith(":")) {
            return false;
          } else {
            params[ps[i].slice(1)] = pns[i];
          }
        }
      }
      _router.setParams(params);
      return true;
    } else {
      if (ps[ps.length - 1] !== "*") {
        return false;
      } else {
        const params = {};
        for (let i = 0; i < ps.length; i++) {
          if (ps[i] !== pns[i]) {
            if (ps.length - 1 === i) {
              continue;
            } else if (!ps[i].startsWith(":")) {
              return false;
            } else {
              params[ps[i].slice(1)] = pns[i];
            }
          }
        }
        _router.setParams(params);
        return true;
      }
    }
  });

  return <>{child}</>;
};

const Route = (props) => {
  const { element } = props;
  return element;
};

const Link = ({ children }) => {
  return <a>{children}</a>;
};

export { RouterProvider, Routes, Route, useNavigate, useLocation };
