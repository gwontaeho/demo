export const Table = (props) => {
  const { children, ...rest } = props;
  return (
    <table className="[&_thead]:bg-gray-100" {...rest}>
      {children}
    </table>
  );
};
