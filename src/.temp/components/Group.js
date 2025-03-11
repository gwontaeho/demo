import { Layout } from "./Layout";

const GroupTitle = (props) => {
  const { children } = props;
  return <div>{children}</div>;
};

const GroupSection = (props) => {
  return <Layout {...props} />;
};

const GroupHeader = (props) => {
  const { children } = props;
  return (
    <div className="flex items-center p-2 min-h-12 bg-gray-100 rounded-t">
      {children}
    </div>
  );
};

const GroupFooter = (props) => {
  const { children } = props;
  return (
    <div className="flex items-center p-2 min-h-12 bg-gray-100 rounded-b">
      {children}
    </div>
  );
};

const GroupBody = (props) => {
  return <Layout p={2} {...props} />;
};

export const Group = (props) => {
  const { children, width, height } = props;

  return (
    <div className="rounded shadow" style={{ width, height }}>
      {children}
    </div>
  );
};

Group.Body = GroupBody;
Group.Title = GroupTitle;
Group.Section = GroupSection;
Group.Header = GroupHeader;
Group.Footer = GroupFooter;
