import { useRef, useState, useMemo } from "react";
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
  const {
    flatList,
    itemKey,
    label,
    children,
    expandedKeys,
    checkedKeys,
    toggleExpanded,
    toggleChecked,
  } = props;

  const checked = checkedKeys.has(itemKey);

  return (
    <li
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="p-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
        <div className="w-5 h-5 flex items-center justify-center">
          {children && (
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded(itemKey);
              }}
            >
              <Icon name="right" />
            </button>
          )}
        </div>

        <div className="w-5 h-5 flex items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleChecked(itemKey)}
          />
        </div>
        <span className="text-sm">{label}</span>
      </div>
      {children && expandedKeys.has(itemKey) && (
        <ul className="px-2">
          {children.map((item) => {
            return (
              <TreeItem
                {...item}
                flatList={flatList}
                itemKey={item.key}
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                toggleExpanded={toggleExpanded}
                toggleChecked={toggleChecked}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

const Tree = (props) => {
  const { data } = props;

  const list = useMemo(() => data, []);
  const flatList = useMemo(() => {
    const flat = (ary, parent, parentKeys = []) => {
      return ary.reduce((prev, curr) => {
        const item = { ...curr };
        item.parent = parent;
        item.parentKeys = parentKeys;
        if (item.children) {
          const result = flat(item.children, item, [...parentKeys, item.key]);
          prev.push(...result);
        }
        prev.push(item);
        return prev;
      }, []);
    };

    return flat(list).reduce((prev, curr, idx, ary) => {
      curr.childKeys = ary
        .filter((item) => item.parentKeys.includes(curr.key))
        .map((item) => item.key);
      prev.push(curr);
      return prev;
    }, []);
  }, []);

  console.log(flatList);

  const [expandedKeys, setExpandedKeys] = useState(() => new Set());
  const [checkedKeys, setCheckedKeys] = useState(() => new Set());

  const toggleExpanded = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleChecked = (key) => {
    const target = flatList.find((item) => item.key === key);

    setCheckedKeys((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
        target.childKeys.forEach((childKey) => {
          next.delete(childKey);
        });
      } else {
        next.add(key);
        target.childKeys.forEach((childKey) => {
          next.add(childKey);
        });
      }

      (function checkParent(parent) {
        if (!parent) return;
        if (parent.childKeys.every((childKey) => next.has(childKey))) {
          next.add(parent.key);
        } else {
          next.delete(parent.key);
        }
        checkParent(parent.parent);
      })(target.parent);

      return next;
    });
  };

  return (
    <ul>
      {list.map((item) => {
        return (
          <TreeItem
            {...item}
            flatList={flatList}
            itemKey={item.key}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            toggleExpanded={toggleExpanded}
            toggleChecked={toggleChecked}
          />
        );
      })}
    </ul>
  );
};

export { Tree, useTree };
