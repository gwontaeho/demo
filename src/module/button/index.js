const BUTTON_ROLES = {
  submit: { text: "Submit" },
  cancel: { text: "Cancel" },
  save: { text: "Save" },
  add: { text: "Add" },
  delete: { text: "Delete" },
  search: { text: "Search" },
  close: { text: "Close" },
  confirm: { text: "Confirm" },
};

// save: { text: "B_SAVE", color: "primary", variant: "button-contained", icon: undefined },
// list: { text: "B_LST", color: "gray", variant: "button-contained", icon: undefined },
// submit: { text: "B_SBMT", color: "warning", variant: "button-contained", icon: undefined },
// search: { text: "B_SRCH", color: "blue", variant: "button-contained", icon: undefined },
// close: { text: "B_CLS", color: "error", variant: "button-contained", icon: undefined },
// add: { text: "B_ADD", color: "blue", variant: "button-contained", icon: undefined },
// delete: { text: "B_DEL", color: "error", variant: "button-contained", icon: undefined },
// reset: { text: "B_RESET", color: "warning", variant: "button-contained", icon: undefined },
// confirm: { text: "B_CFRM", color: "success", variant: "button-contained", icon: undefined },
// ok: { text: "B_OK", color: "primary", variant: "button-contained", icon: undefined },
// edit: { text: "B_EDIT", color: "primary", variant: "button-contained", icon: undefined },
// new: { text: "B_NEW", color: "gray", variant: "button-contained", icon: undefined },
// cancel: { text: "B_CNCL", color: "warning", variant: "button-contained", icon: undefined },
// apply: { text: "B_APPD", color: "blue", variant: "button-contained", icon: undefined },
// gridAdd: { text: "B_ADD", color: "blue", variant: "button-outlined", icon: undefined },
// gridDelete: { text: "B_DELETE", color: "error", variant: "button-outlined", icon: undefined },
// excelDown: { text: "B_EXC_DWNL", color: "info", variant: "button-outlined", icon: "bars_arrow_down" },
// excelDownServer: { text: "B_EXC_DWNL", color: "info", variant: "button-outlined", icon: "cloud_arrow_down" },
// tmplDown: { text: "B_TMPL_DWNL", color: "info", variant: "button-outlined", icon: undefined },
// excelUpload: { text: "B_EXC_UPLD", color: "info", variant: "button-outlined", icon: undefined },

const Button = (props) => {
  const { children, role, ...rest } = props;

  const roleObject = BUTTON_ROLES[role];
  const buttonText = roleObject ? roleObject.text : children;

  return (
    <button type="button" className="text-sm border h-6 px-2" {...rest}>
      {buttonText}
    </button>
  );
};

export { Button };
