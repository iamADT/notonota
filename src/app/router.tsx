import { Navigate, createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { CaptureScreen } from "../routes/CaptureScreen";
import { EditPersonScreen } from "../routes/EditPersonScreen";
import { PersonDetailScreen } from "../routes/PersonDetailScreen";
import { ReviewScreen } from "../routes/ReviewScreen";
import { SavedScreen } from "../routes/SavedScreen";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/capture" replace /> },
      { path: "capture", element: <CaptureScreen /> },
      { path: "saved", element: <SavedScreen /> },
      { path: "review", element: <ReviewScreen /> },
      { path: "person/:id", element: <PersonDetailScreen /> },
      { path: "person/:id/edit", element: <EditPersonScreen /> }
    ]
  }
];

export const router = createBrowserRouter(routes);
