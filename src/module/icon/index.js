import { Search } from "./components/Search";

const Icon = (props) => {
  const { name } = props;
  const properties = { className: "size-3" };

  switch (name) {
    case "search":
      return <Search {...properties} />;
    default:
      return null;
  }
};

export { Icon };
