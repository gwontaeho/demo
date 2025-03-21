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
import { SampleFetch } from "./sample/SampleFetch";
import { SampleControl } from "./sample/SampleControl";
import { SamplePage } from "./sample/SamplePage";
import { SampleTheme } from "./sample/SampleTheme";
import { SampleButton } from "./sample/SampleButton";

import { ResourceProvider } from "./modules/resource";
import { RouterProvider } from "./modules/router";
import { StoreProvider } from "./modules/store";
import { ModalProvider } from "./modules/modal";
import { ToastProvider } from "./modules/toast";
import { ThemeProvider } from "./modules/theme";

import { useForm } from "react-hook-form";

function App() {
  console.log("APP");

  const a = useForm();
  // console.log(a.register);

  return (
    <div className="p-8">
      {/* <SampleControl /> */}
      {/* <SampleFetch /> */}
      {/* <SampleResource /> */}
      {/* <SampleTree /> */}
      {/* <SampleTab /> */}
      {/* <SampleRouter /> */}
      {/* <SamplePopup /> */}
      {/* <SampleApi /> */}
      {/* <SampleModal /> */}
      {/* <SamplePage /> */}
      {/* <SampleForm /> */}
      <SampleGrid />
      {/* <SampleTheme /> */}
      {/* <SampleButton /> */}
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  // <StrictMode>
  <ResourceProvider>
    <RouterProvider>
      <StoreProvider>
        <ThemeProvider>
          <ModalProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ModalProvider>
        </ThemeProvider>
      </StoreProvider>
    </RouterProvider>
  </ResourceProvider>
  // </StrictMode>
);
