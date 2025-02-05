import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SampleApi } from "./sample/SampleApi";
import { SampleForm } from "./sample/SampleForm";
import { SampleGrid } from "./sample/SampleGrid";
import { SampleModal } from "./sample/SampleModal";
import { SamplePopup } from "./sample/SamplePopup";

import { ModalProvider } from "./modules/modal";
import { ToastProvider } from "./modules/toast";

function App() {
  console.log("APP");
  return (
    <div className="p-8">
      <SamplePopup />
      {/* <SampleApi /> */}
      {/* <SampleModal /> */}
      {/* <SampleForm /> */}
      {/* <SampleGrid /> */}
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <StrictMode>
    <ModalProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ModalProvider>
  </StrictMode>
);
