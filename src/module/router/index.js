import {
  createContext,
  useContext,
  useRef,
  useReducer,
  useEffect,
  useMemo,
  useState,
  cloneElement,
  Children,
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
const RouterSetterContext = createContext();
const RouteContext = createContext();

const RouterProvider = ({ children }) => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);
  const _ = useRef({ params: {} }).current;

  useEffect(() => {
    const handlePopstate = () => {
      _.params = {};
      setPathname(window.location.pathname);
      setSearch(window.location.search);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      return window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const routerContextValue = useMemo(() => {
    return { pathname, search, params: _.params };
  }, [pathname, search]);

  const routerContextSetter = useMemo(() => {
    return {
      setParams: (params) => {
        _.params = params;
      },
      navigate: (to) => {
        _.params = {};
        window.history.pushState({}, "", to);
        const [pathname, search] = to.split("?");
        setPathname(pathname || "/");
        setSearch(search ? "?" + search : "");
      },
    };
  }, []);

  return (
    <RouterValueContext.Provider value={routerContextValue}>
      <RouterSetterContext.Provider value={routerContextSetter}>
        {children}
      </RouterSetterContext.Provider>
    </RouterValueContext.Provider>
  );
};

const useNavigate = () => {
  const { navigate } = useContext(RouterSetterContext);
  return navigate;
};

const useLocation = () => {};

const useParams = () => {};
const useSearchParams = () => {};

const Routes = (props) => {
  const { children } = props;

  const { pathname } = useContext(RouterValueContext);
  const { setParams } = useContext(RouterSetterContext);

  console.log(children);

  // const child = (Array.isArray(children) ? children : [children]).find(
  //   (child) => {
  //     const { path } = child.props;

  //     if (path === undefined) return false;
  //     if (path === pathname) return true;

  //     const p1 = path.split("/");
  //     const p2 = pathname.split("/");

  //     if (p1.length > p2.length) return false;

  //     if (p1.length === p2.length) {
  //       const params = {};
  //       for (let i = 0; i < p1.length; i++) {
  //         if (p1[i] === p2[i]) continue;
  //         if (p1[i].startsWith(":")) {
  //           params[p1[i].slice(1)] = p2[i];
  //           continue;
  //         }
  //         if (p1.length - 1 === i && p1[i] === "*") continue;
  //         return false;
  //       }
  //       setParams(params);
  //       return true;
  //     } else {
  //       const params = {};
  //       if (p1[p1.length - 1] !== "*") return false;
  //       for (let i = 0; i < p1.length - 1; i++) {
  //         if (p1[i] === p2[i]) continue;
  //         if (p1[i].startsWith(":")) {
  //           params[p1[i].slice(1)] = p2[i];
  //           continue;
  //         }
  //         return false;
  //       }
  //       setParams(params);
  //       return true;
  //     }
  //   }
  // );

  return <>{children}</>;
};

const Route = (props) => {
  const { children, path: parentPath = "/", element } = props;

  console.log(element);

  return (
    element ??
    Children.map(children, (child) => {
      const path = (parentPath === "/" ? "" : parentPath) + child.props.path;
      return cloneElement(child, { path });
    }) ??
    null
  );
};

export { RouterProvider, Routes, Route, useNavigate, useLocation };
