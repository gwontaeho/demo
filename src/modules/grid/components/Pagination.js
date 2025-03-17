import { useState } from "react";
import { useGridContext } from "../hooks/useGridContext";

const Pagination = (props) => {
  const { page, count = 0, perPage = 10, chunk = 10, onChange } = props;
  const { getKeyBase } = useGridContext();
  const keyBase = getKeyBase();
  const [cursor, setCursor] = useState(0);
  const chunked = [];
  const pageCount = Math.ceil(count / perPage) || 1;
  const chunkCount = Math.ceil(pageCount / chunk);
  const pages = [...new Array(pageCount).keys()];
  for (let i = 0; i < chunkCount; i++)
    chunked.push(pages.slice(i * chunk, (i + 1) * chunk));
  const list = chunked[cursor];

  const handlePrevClick = () => {
    if (cursor > 0) {
      setCursor((prev) => (prev -= 1));
    }
  };
  const handleNextClick = () => {
    if (cursor < chunkCount - 1) {
      setCursor((prev) => (prev += 1));
    }
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="text-sm border rounded w-6 h-6"
        onClick={handlePrevClick}
      >{`<`}</button>
      {list?.map((value) => {
        const key = `${keyBase}:p:${value}`;
        return (
          <button
            key={key}
            type="button"
            className={
              "text-sm border rounded w-6 h-6" +
              (page === value ? " font-semibold" : "")
            }
            onClick={() => onChange?.(value)}
          >
            {value + 1}
          </button>
        );
      })}
      <button
        type="button"
        className="text-sm border rounded w-6 h-6"
        onClick={handleNextClick}
      >{`>`}</button>
    </div>
  );
};

export { Pagination };
