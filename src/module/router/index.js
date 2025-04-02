import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
  useState,
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

const RouterValueContext = createContext();
const RouterMethodContext = createContext();
const OutletContext = createContext();

const RouterProvider = ({ children }) => {
  const _ = useRef({ matched: {}, outlets: [], params: {} }).current;
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const handlePopstate = () => {
      setPathname(window.location.pathname);
      setSearch(window.location.search);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      return window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const routerValue = useMemo(() => {
    return { pathname, search };
  }, [pathname, search]);

  const routerMethod = useMemo(() => {
    return {
      getRouter: () => {
        return _;
      },
      setRouter: ({ matched, outlets, params }) => {
        _.matched = matched;
        _.outlets = outlets;
        _.params = params;
      },

      navigate: (to) => {
        window.history.pushState({}, "", to);
        const [pathname, search] = to.split("?");
        setPathname(pathname || "/");
        setSearch(search ? "?" + search : "");
      },
    };
  }, []);

  return (
    <RouterValueContext.Provider value={routerValue}>
      <RouterMethodContext.Provider value={routerMethod}>
        {children}
      </RouterMethodContext.Provider>
    </RouterValueContext.Provider>
  );
};

const useNavigate = () => {
  const { navigate } = useContext(RouterMethodContext);
  return navigate;
};

const useLocation = () => {};

const useParams = () => {};
const useSearchParams = () => {};

const Outlet = () => {
  const { getRouter } = useContext(RouterMethodContext);
  const { outlets } = getRouter();
  const outletValue = useContext(OutletContext);
  const value = (outletValue ?? 0) + 1;
  const Component = outlets[value]?.Component;
  return Component ? (
    <OutletContext.Provider value={value}>
      <Component />
    </OutletContext.Provider>
  ) : null;
};

const Router = (props) => {
  // console.log("=== router !! ");
  const { pathname } = useContext(RouterValueContext);
  const { setRouter } = useContext(RouterMethodContext);

  const { router } = props;

  const reducer = (target, parentPath = "/", parents = []) => {
    parentPath = parentPath === "/" ? "" : parentPath;
    return target.reduce((prev, curr) => {
      let { path, Component, children } = curr;
      path = parentPath + path;
      const route = { path, Component, parents: [...parents] };
      prev.push(route);
      if (children) {
        parents.push(route);
        prev.push(...reducer(children, path, parents));
      }
      return prev;
    }, []);
  };

  let params = {};
  const matched =
    reducer(router).find(({ path }) => {
      if (path === undefined) return false;
      if (path === pathname) return true;
      const p1 = path.split("/");
      const p2 = pathname.split("/");
      if (p1.length > p2.length) return false;
      if (p1.length < p2.length && p1[p1.length - 1] !== "*") return false;
      const _params = {};
      for (let i = 0; i < p1.length; i++) {
        if (p1.length - 1 === i && p1[i] === "*") continue;
        if (p1[i] === p2[i]) continue;
        if (p1[i].startsWith(":")) {
          _params[p1[i].slice(1)] = p2[i];
          continue;
        }
        return false;
      }
      params = _params;
      return true;
    }) ?? {};

  const outlets = matched.parents?.filter(({ Component }) => Component) ?? [];
  outlets.push(matched);

  setRouter({ matched, outlets, params });

  const Component = outlets[0]?.Component;
  return Component ? <Component /> : null;
};

export { Outlet, RouterProvider, Router, useNavigate, useLocation };
