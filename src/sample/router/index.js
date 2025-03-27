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

export const sampleRouter = {
  path: "/doc",
  Component: SampleLayout,
  children: [
    { path: "/modal", Component: SampleModal },
    { path: "/toast", Component: SampleToast },
    { path: "/form", Component: SampleForm },
    { path: "/popup", Component: SamplePopup },
    { path: "/tab", Component: SampleTab },
    { path: "/fetch", Component: SampleFetch },
    { path: "/button", Component: SampleButton },
    { path: "/theme", Component: SampleTheme },
    { path: "/control", Component: SampleControl },
  ],
};
