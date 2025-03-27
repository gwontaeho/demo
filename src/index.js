import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ResourceProvider } from "./module/resource";
import { RouterProvider } from "./module/router";
import { StoreProvider } from "./module/store";
import { ModalProvider } from "./module/modal";
import { ToastProvider } from "./module/toast";
import { ThemeProvider } from "./module/theme";

import { Router } from "./module/router";
import { sampleRouter } from "./sample/router";

const router = [sampleRouter];

function App() {
  return <Router router={router} />;
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <StrictMode>
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
  </StrictMode>
);
