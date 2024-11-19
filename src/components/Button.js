export const Button = (props) => {
  const { children, type = "button", ...rest } = props;
  return (
    <button type={type} className="border px-4 min-h-8" {...rest}>
      {children}
    </button>
  );
};
