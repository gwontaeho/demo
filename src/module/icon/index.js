import { cloneElement } from "react";

import { Search } from "./components/Search";
import { Right } from "./components/Right";

const icons = {
  search: <Search />,
  right: <Right />,
};

/**
 * @typedef {Object} IconProps
 * @property {keyof typeof icons} [name]
 */

/**
 *
 * @param {IconProps} props
 * @returns
 */
const Icon = (props) => {
  const { name } = props;
  const icon = icons[name];

  return icon ? cloneElement(icons[name], { className: "size-3" }) : null;
};

export { Icon };
