import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./modules/resource";

import { SampleApi } from "./sample/SampleApi";
import { SampleForm } from "./sample/SampleForm";
import { SampleGrid } from "./sample/SampleGrid";
import { SampleModal } from "./sample/SampleModal";
import { SamplePopup } from "./sample/SamplePopup";
import { SampleRouter } from "./sample/SampleRouter";
import { SampleTab } from "./sample/SampleTab";
import { SampleTree } from "./sample/SampleTree";
import { SampleResource } from "./sample/SampleResource";

import { RouterProvider } from "./modules/router";
import { StoreProvider } from "./modules/store";
import { ModalProvider } from "./modules/modal";
import { ToastProvider } from "./modules/toast";

function App() {
  console.log("APP");
  return (
    <div className="p-8">
      <SampleResource />
      {/* <SampleTree /> */}
      {/* <SampleTab /> */}
      {/* <SampleRouter /> */}
      {/* <SamplePopup /> */}
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
    <RouterProvider>
      <StoreProvider>
        <ModalProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ModalProvider>
      </StoreProvider>
    </RouterProvider>
  </StrictMode>
);
