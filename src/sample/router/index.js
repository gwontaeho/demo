import { SampleLayout } from "../layout/Layout";

import { SampleApi } from "../pages/SampleApi";
import { SampleForm } from "../pages/SampleForm";
import { SampleGrid } from "../pages/SampleGrid";
import { SampleModal } from "../pages/SampleModal";
import { SampleToast } from "../pages/SampleToast";
import { SamplePopup } from "../pages/SamplePopup";
import { SampleRouter } from "../pages/SampleRouter";
import { SampleTab } from "../pages/SampleTab";
import { SampleTree } from "../pages/SampleTree";
import { SampleResource } from "../pages/SampleResource";
import { SampleFetch } from "../pages/SampleFetch";
import { SampleControl } from "../pages/SampleControl";
import { SamplePage } from "../pages/SamplePage";
import { SampleTheme } from "../pages/SampleTheme";
import { SampleButton } from "../pages/SampleButton";
import { SampleIndexedDB } from "../pages/SampleIndexedDB";
import { SampleIcon } from "../pages/SampleIcon";

export const sampleRouter = {
  path: "/docs",
  Component: SampleLayout,
  children: [
    { name: "", path: "/button", Component: SampleButton },
    { name: "", path: "/modal", Component: SampleModal },
    { name: "", path: "/toast", Component: SampleToast },
    { name: "", path: "/popup", Component: SamplePopup },
    { name: "", path: "/tab", Component: SampleTab },
    { name: "", path: "/form", Component: SampleForm },
    { name: "", path: "/fetch", Component: SampleFetch },
    { name: "", path: "/theme", Component: SampleTheme },
    { name: "", path: "/control", Component: SampleControl },
    { name: "", path: "/api", Component: SampleApi },
    { name: "", path: "/grid", Component: SampleGrid },
    { name: "", path: "/router", Component: SampleRouter },
    { name: "", path: "/resouce", Component: SampleResource },
    { name: "", path: "/tree", Component: SampleTree },
    { name: "", path: "/page", Component: SamplePage },
    { name: "", path: "/icon", Component: SampleIcon },
  ],
};
