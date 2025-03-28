import { Highlight } from "../../module/highlight";

const Doc = (props) => {
  const { children } = props;
  return <div className="rounded divide-y">{children}</div>;
};

const H1 = (props) => {
  const { children } = props;
  return <h1 className="px-4 py-8 text-lg bg-gray-100">{children}</h1>;
};

const H2 = (props) => {
  const { children } = props;
  return <h2 className="px-4 py-6 bg-gray-50">{children}</h2>;
};

const H3 = (props) => {
  const { children } = props;
  return <h3 className="p-4 text-sm bg-gray-50">{children}</h3>;
};

const Item = (props) => {
  const { children, className } = props;
  return (
    <div className={"flex p-4" + (className ? ` ${className}` : "")}>
      {children}
    </div>
  );
};

const Table = (props) => {
  const { children } = props;
  return (
    <table className="border flex-1 text-xs [&_tr]:h-12 [&_td]:p-2 [&_th]:p-2 [&_th]:text-left even:[&>tbody>tr]:bg-gray-50">
      {children}
    </table>
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
    <div className="text-xs flex-1">
      <Highlight lang="jsx">{children}</Highlight>
    </div>
  );
};

const Result = (props) => {
  const { children } = props;
  return <div className="flex items-center justify-center p-4">{children}</div>;
};

Doc.H1 = H1;
Doc.H2 = H2;
Doc.H3 = H3;
Doc.Item = Item;
Doc.Desc = Desc;
Doc.Table = Table;
Doc.Button = Button;
Doc.Code = Code;
Doc.Result = Result;

export { Doc };
