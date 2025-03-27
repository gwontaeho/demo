import { Outlet } from "../../module/router";
import { Nav } from "./Nav";

export const SampleLayout = () => {
  return (
    <div className="flex">
      <Nav />
      <div className="w-[calc(100%-240px)]">
        <Outlet />
      </div>
    </div>
  );
};
