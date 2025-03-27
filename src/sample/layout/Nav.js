import { useNavigate } from "../../module/router";
import { sampleRouter } from "../router";

export const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className="min-w-60 h-screen border-r sticky top-0 left-0">
      <ul className="text-sm [&>li]:p-4">
        {sampleRouter.children.map(({ path }) => {
          return (
            <li
              key={path}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => {
                navigate("/docs" + path);
              }}
            >
              {path.slice(1)}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
