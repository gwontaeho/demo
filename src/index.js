import "./index.css";
import { useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { VariableSizeList } from "react-window";
// import { useSocket } from "./socket/socket";

const SocketExample = () => {
    const { emit } = useSocket();
    const handleClick = () => {
        console.log("a");
        emit("test", { data: "asd" });
    };
    return (
        <div>
            <button onClick={handleClick}>g</button>
        </div>
    );
};

const List = () => {
    const rowHeights = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

    const getItemSize = (index) => rowHeights[index];

    const Row = ({ index, style }) => {
        return (
            <div style={style}>
                <div className="w-96">asd</div>
            </div>
        );
    };

    return (
        <VariableSizeList
            innerElementType={({ children }) => {
                return (
                    <>
                        <div className="sticky top-0">qwd</div>
                        {children}
                    </>
                );
            }}
            height={150}
            itemCount={1000}
            itemSize={getItemSize}
            width={300}
        >
            {Row}
        </VariableSizeList>
    );
};

const templateMaker = (schema) => {
    const mapped = schema.map((col) => {
        if (col.colspan === undefined) col.colspan = 1;
        if (col.rowspan === undefined) col.rowspan = 1;
        for (const cel of col.cels) {
            if (cel.colspan === undefined) cel.colspan = 1;
            if (cel.rowspan === undefined) cel.rowspan = 1;
            if (cel.width === undefined) cel.width = 100;
        }
        return col;
    });

    let widths = [];
    for (const col of mapped) {
        let colWidths = [];
        let index = 0;
        for (const cel of col.cels) {
            if (cel.colspan > 1) {
                let celWidth;
                switch (typeof cel.width) {
                    case "number":
                        celWidth = `${cel.width / cel.colspan}px`;
                        break;
                    case "string":
                        const fr = cel.width.slice(0, -1) || 1;
                        celWidth = `minmax(100px, ${fr}fr)`;
                        break;
                    default:
                        celWidth = "100px";
                        break;
                }
                for (let i = 0; i < cel.colspan; i++) {
                    colWidths[index % cel.colspan] = celWidth;
                    index += 1;
                }
            } else {
                colWidths[index % col.colspan] = `${cel.width}px`;
                index += 1;
            }
        }
        widths.push(...colWidths);
    }

    let template = [];
    for (const col of mapped) {
        let celCount = 0;
        let rowIndex = 0;
        for (const cel of col.cels) {
            if (
                (celCount % col.colspan) + cel.colspan > col.colspan ||
                (celCount !== 0 && celCount % col.colspan === 0)
            ) {
                rowIndex += 1;
            }
            if (template[rowIndex] === undefined) {
                template[rowIndex] = [];
            }
            template[rowIndex].push(cel);
            celCount += cel.colspan;
        }
    }

    return {
        template,
        gridTemplateColumns: widths.join(" "),
    };
};

function App() {
    const grid = useRef({
        listRef: null,
        rowHeights: [],
    });

    const data = [
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
    ];

    const headSchema = [
        {
            colspan: 3,
            cels: [
                { binding: "1", width: 200, colspan: 2 },
                { binding: "1", width: 200, colspan: 1 },
                { binding: "1", width: 200, colspan: 1 },
                { binding: "1", width: 200, colspan: 1 },
                { binding: "1", width: 200, colspan: 1 },
            ],
        }, //
        { cels: [{ binding: "2", width: 200, rowspan: 2 }] },
        { cels: [{ binding: "3", width: 200, rowspan: 2 }] },
        { cels: [{ binding: "4" }] },
    ];

    const bodySchema = [
        {
            colspan: 3,
            cels: [
                { binding: "1", colspan: 2 },
                { binding: "1", colspan: 1 },
                { binding: "1", colspan: 1 },
                { binding: "1", colspan: 1 },
                { binding: "1", colspan: 1 },
            ],
        }, //
        { cels: [{ binding: "2", rowspan: 2 }] },
        { cels: [{ binding: "3", rowspan: 2 }] },
        { cels: [{ binding: "4" }] },
    ];

    // style={{
    //     gridRow: `${rowIndex + 1} / span ${rowspan ?? 1}`,
    //     gridColumn: `${colIndex + 1} / span ${colspan ?? 1}`,
    // }}

    const { gridTemplateColumns, template: headTemplate } = templateMaker(headSchema);
    const { template: bodyTemplate } = templateMaker(bodySchema);

    const rowHeights = new Array(1000).fill(true).map(() => 125 + Math.round(Math.random() * 50));

    const getItemSize = (index) => {
        console.log("a");
        return rowHeights[index];
    };

    const Row = (props) => {
        const {
            style,
            index,
            data: { grid, data, bodyTemplate, gridTemplateColumns },
        } = props;

        const item = data[index];

        console.log(item);

        const resizeObserverRef = useRef();

        const refCallback = useCallback((ref) => {
            if (!ref) return;

            resizeObserverRef.current = new ResizeObserver((entries) => {
                requestAnimationFrame(() => {
                    entries.forEach((entry) => {
                        const prevHeight = grid.current.rowHeights[index];
                        const nextHeight = entry.contentRect.height;
                        if (nextHeight <= 0 || prevHeight === nextHeight) return;

                        grid.current.rowHeights[index] = nextHeight;
                        grid.current.listRef.resetAfterIndex(index);
                    });
                });
            });

            resizeObserverRef.current.observe(ref);
        }, []);

        return (
            <div ref={refCallback} style={{ ...style, display: "grid", gridTemplateColumns }}>
                {bodyTemplate.map((col) => {
                    return col.map((props) => {
                        return (
                            <div
                                className="p-4 border"
                                style={{ gridArea: `span ${props.rowspan} / span ${props.colspan}` }}
                            >
                                {props.binding}
                            </div>
                        );
                    });
                })}
            </div>
        );
    };

    return (
        <div>
            <div className="grid" style={{ gridTemplateColumns }}>
                {headTemplate.map((col) => {
                    return col.map((props) => {
                        return (
                            <div
                                className="p-4 border"
                                style={{ gridArea: `span ${props.rowspan} / span ${props.colspan}` }}
                            >
                                {props.binding}
                            </div>
                        );
                    });
                })}
            </div>

            <VariableSizeList
                ref={(ref) => {
                    if (grid.current.listRef === null) {
                        grid.current.listRef = ref;
                    }
                }}
                innerElementType={({ children }) => {
                    return (
                        <>
                            <div className="sticky top-0">qwd</div>
                            {children}
                        </>
                    );
                }}
                height={500}
                itemCount={data.length}
                itemSize={getItemSize}
                width={1000}
                itemData={{ grid, data, bodyTemplate, gridTemplateColumns }}
            >
                {Row}
            </VariableSizeList>
        </div>
    );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
