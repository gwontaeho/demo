import { Highlight } from "../../module/highlight";

const Doc = (props) => {
  const { children } = props;
  return <div className="rounded divide-y">{children}</div>;
};

const H1 = (props) => {
  const { children } = props;
  return <h1 className="p-4 text-lg">{children}</h1>;
};

const H2 = (props) => {
  const { children } = props;
  return <h2 className="p-4 bg-gray-50">{children}</h2>;
};

const Item = (props) => {
  const { children, className } = props;
  return (
    <div className={"flex p-4" + (className ? ` ${className}` : "")}>
      {children}
    </div>
  );
};

const Desc = (props) => {
  const { children, ...rest } = props;
  return (
    <div className="text-sm w-80 flex flex-col justify-center" {...rest}>
      {children}
    </div>
  );
};

const Button = (props) => {
  const { children, ...rest } = props;
  return (
    <button type="button" className="text-sm w-80 text-left" {...rest}>
      {children}
    </button>
  );
};

const Code = (props) => {
  const { children } = props;
  return (
    <div className="text-sm flex-1">
      <Highlight lang="jsx">{children}</Highlight>
    </div>
  );
};

Doc.H1 = H1;
Doc.H2 = H2;
Doc.Item = Item;
Doc.Desc = Desc;
Doc.Button = Button;
Doc.Code = Code;

export { Doc };
