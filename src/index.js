import "./index.css";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  createElement,
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
// import { Grid } from "./grid/Grid";
import { useForm as useForm123, useController } from "react-hook-form";
import { useForm } from "./hooks/useForm";
import { Control } from "./components/Control";
import { Form } from "./components/Form";
import { Button } from "./components/Button";
import { Grid } from "./components/Grid";
import utils from "./utils";
import { useGrid } from "./hooks/useGrid";
import { Layout } from "./components/Layout";
import { Group } from "./components/Group";
import { Page } from "./components/Page";
import { Table } from "./components/Table";
import { api } from "./apis";
import axios from "axios";

function App() {
  const getSomething = async () => {
    try {
      const response = await api.get("http://localhost:5000/test");
      console.log(response);
    } catch (error) {
      // console.log(error);
    }
    // try {
    //   const a = await axios.get("http://localhost:5000/test");
    //   console.log(a);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    // getSomething();
    // test();
    // console.log(utils.date("2022-11-04").set("2001-01-01").time);
    // console.log(utils.date().setMonth(1, 2).format("YYYY.MM.DD"));
    const sym = Symbol("test");
    console.log(
      utils.date("1994-11-16 05:10:22").subtract("w", 1).format("YYYY-MM-DD")
    );

    const a = {
      abc: function () {
        console.log(this);
      },
    };

    // const c = a.abc.bind("a");
    // c();
  }, []);

  const test = () => {
    getCookies();
  };

  const getCookies = () => {
    console.log();
  };

  return (
    <div>
      <button
        onClick={() => {
          utils.cookie.remove("a");
        }}
      >
        remove
      </button>
      s
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
