import { useNavigate } from "../../module/router";

export const Nav = () => {
  const navigate = useNavigate();

  const docList = [
    { name: "Modal", path: "/doc/modal" },
    { name: "Toast", path: "/doc/toast" },
    { name: "Form", path: "/doc/form" },
    { name: "Tab", path: "/doc/modal" },
    { name: "Grid", path: "/doc/modal" },
  ];

  return (
    <nav className="min-w-60 h-screen border-r sticky top-0 left-0">
      <ul className="text-sm [&>li]:p-4">
        {docList.map(({ name, path }) => {
          return (
            <li
              key={name}
              onClick={() => {
                navigate(path);
              }}
            >
              {name}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
