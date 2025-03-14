import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SampleApi } from "./sample/SampleApi";
import { SampleForm } from "./sample/SampleForm";
import { SampleGrid } from "./sample/SampleGrid";
import { SampleModal } from "./sample/SampleModal";
import { SamplePopup } from "./sample/SamplePopup";
import { SampleRouter } from "./sample/SampleRouter";
import { SampleTab } from "./sample/SampleTab";
import { SampleTree } from "./sample/SampleTree";
import { SampleResource } from "./sample/SampleResource";
import { SampleData } from "./sample/SampleData";
import { SampleControl } from "./sample/SampleControl";

import { ResourceProvider } from "./modules/resource";
import { RouterProvider } from "./modules/router";
import { StoreProvider } from "./modules/store";
import { ModalProvider } from "./modules/modal";
import { ToastProvider } from "./modules/toast";

import { useForm } from "react-hook-form";

function App() {
  console.log("APP");

  const a = useForm();
  // console.log(a.register);

  return (
    <div className="p-8">
      {/* <SampleControl /> */}
      {/* <SampleData /> */}
      {/* <SampleResource /> */}
      {/* <SampleTree /> */}
      {/* <SampleTab /> */}
      {/* <SampleRouter /> */}
      {/* <SamplePopup /> */}
      {/* <SampleApi /> */}
      {/* <SampleModal /> */}
      {/* <SampleForm /> */}
      <SampleGrid />
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <StrictMode>
    <ResourceProvider>
      <RouterProvider>
        <StoreProvider>
          <ModalProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ModalProvider>
        </StoreProvider>
      </RouterProvider>
    </ResourceProvider>
  </StrictMode>
);
