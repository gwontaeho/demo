import "./index.css";
import { StrictMode } from "react";
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
import { SampleForm } from "./sample/SampleForm";
import { SampleGrid } from "./sample/SampleGrid";

function App() {
  return (
    <div className="p-8">
      {/* <SampleForm /> */}
      <SampleGrid />
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
