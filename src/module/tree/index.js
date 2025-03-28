import { useRef, useState } from "react";
import { Icon } from "../icon";

const useTree = () => {
  const _useTree = useRef(
    new (class {
      #schema = {};

      openTree = () => {};
      closeTree = () => {};
    })()
  ).current;

  return {};
};

const TreeItem = (props) => {
  const { label, children, expanded } = props;

  const [open, setOpen] = useState(false);

  return (
    <li
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="p-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
        <div className="w-5 h-5">
          {children && (
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(event) => {
                event.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              <Icon name="right" />
            </button>
          )}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      {children && open && (
        <ul className="px-2">
          {children.map((item) => {
            return <TreeItem {...item} />;
          })}
        </ul>
      )}
    </li>
  );
};

const Tree = (props) => {
  const { data } = props;

  const [expanded, setExpanded] = useState([]);
  const [checked, setChecked] = useState([]);

  return (
    <ul>
      {data.map((item) => {
        return (
          <TreeItem
            expanded={expanded}
            checked={checked}
            setExpanded={setExpanded}
            setChecked={setChecked}
            {...item}
          />
        );
      })}
    </ul>
  );
};

export { Tree, useTree };
