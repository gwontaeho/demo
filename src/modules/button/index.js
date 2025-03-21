const Button = (props) => {
  const { children, ...rest } = props;
  return (
    <button type="button" className="text-sm border h-6 px-2" {...rest}>
      {children}
    </button>
  );
};

export { Button };
