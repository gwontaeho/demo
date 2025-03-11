import { useId, useRef, useState, useEffect, forwardRef } from "react";
import { createPortal } from "react-dom";

const Calendar = (props) => {
  const { $ControlDate, value, handleChange } = props;

  const now = new Date();

  const id = useId();
  const [current, setCurrent] = useState(
    new Date((value instanceof Date ? value : now).setHours(0, 0, 0, 0))
  );

  const first = new Date(new Date(current).setDate(1));
  const last = new Date(new Date(current).setMonth(current.getMonth() + 1, 0));

  const items = [];
  for (let i = 0; i < last.getDate(); i++) {
    items.push({
      type: "curr",
      date: new Date(new Date(current).setDate(i + 1)),
    });
  }
  for (let i = 0; i < first.getDay(); i++) {
    items.unshift({
      type: "prev",
      date: new Date(new Date(first).setDate(-i)),
    });
  }
  for (let i = 0; items.length < 42; i++) {
    items.push({
      type: "next",
      date: new Date(new Date(last).setDate(last.getDate() + i + 1)),
    });
  }

  useEffect(() => {
    const close = (event) => {
      if (event.type === "pointerdown") {
        if (event.target === $ControlDate.current.ref) {
          return;
        }
      }

      handleChange(
        !$ControlDate.current.value ||
          isNaN(new Date($ControlDate.current.value))
          ? null
          : new Date($ControlDate.current.value)
      );

      $ControlDate.current.setIsOpen(false);
      $ControlDate.current.ref.blur();
    };

    const handlekeydown = (event) => {
      switch (event.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // esc
          close(event);
          break;
      }
    };

    window.addEventListener("wheel", close);
    window.addEventListener("scroll", close);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", handlekeydown);

    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("scroll", close);
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", handlekeydown);
    };
  }, []);

  const { top, left, height } =
    $ControlDate.current.ref.getBoundingClientRect();

  return (
    <div
      className="fixed border shadow w-64 text-xs bg-white"
      style={{ left: left, top: top + height + 4 }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="flex items-center px-2 h-8 justify-between">
        <div>{`${current.getFullYear()} ${current.getMonth() + 1}`}</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrent(
                (prev) => new Date(prev.setMonth(prev.getMonth() - 1))
              );
            }}
          >
            prev
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrent(
                (prev) => new Date(prev.setMonth(prev.getMonth() + 1))
              );
            }}
          >
            next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 h-60 place-items-center gap-1 p-1">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
        {items.map((item, index) => {
          let isSelected =
            value instanceof Date &&
            value.getFullYear() === item.date.getFullYear() &&
            value.getMonth() === item.date.getMonth() &&
            value.getDate() === item.date.getDate();

          return (
            <button
              key={id + index}
              type="button"
              className={
                "border w-full h-full" +
                (item.type !== "curr" ? " text-gray-400" : "") +
                (isSelected ? " font-bold" : "")
              }
              onClick={() => {
                handleChange(item.date);
                $ControlDate.current.setIsOpen(false);
              }}
            >
              {item.date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between px-2 h-8">
        <button
          type="button"
          onClick={() => {
            handleChange(null);
            $ControlDate.current.setIsOpen(false);
          }}
        >
          삭제
        </button>
        <button
          type="button"
          onClick={() => {
            handleChange(null);
            $ControlDate.current.setIsOpen(false);
          }}
        >
          today
        </button>
      </div>
    </div>
  );
};

export const ControlDate = forwardRef((props, ref) => {
  const { onChange, value, ...rest } = props;

  const [isOpen, setIsOpen] = useState(false);
  const $ = useRef({ ref: null, value, setIsOpen });
  $.current.value = value;

  const handleChange = (event) => {
    onChange?.(event);
  };

  let formatted = "";
  if (value instanceof Date) {
    formatted = `${value.getFullYear()}-${value.getMonth() + 1 > 9 ? "" : "0"}${
      value.getMonth() + 1
    }-${value.getDate() > 9 ? "" : "0"}${value.getDate()}`;
  } else if (typeof value === "string") {
    formatted = value;
  }

  return (
    <>
      <input
        type="text"
        className={"border h-8 px-2 w-full bg-slate-50"}
        autoComplete="off"
        ref={(element) => {
          $.current.ref = element;
          if (ref instanceof Function) {
            ref(element);
          } else if (ref.current) {
            ref.current = element;
          }
        }}
        onFocus={() => {
          if (!isOpen) {
            setIsOpen(true);
          }
        }}
        onChange={handleChange}
        value={formatted}
        {...rest}
      />

      {isOpen &&
        createPortal(
          <Calendar
            $ControlDate={$}
            value={value}
            handleChange={handleChange}
          />,
          document.body
        )}
    </>
  );
});
