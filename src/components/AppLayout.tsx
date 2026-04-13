import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ReviewNotificationManager } from "./ReviewNotificationManager";

const TITLES: Record<string, string> = {
  "/capture": "Capture",
  "/saved": "Saved",
  "/review": "Review",
  "/person/:id": "Person",
  "/person/:id/edit": "Edit"
};

function getTitle(pathname: string) {
  if (pathname.startsWith("/person/") && pathname.endsWith("/edit")) {
    return TITLES["/person/:id/edit"];
  }

  if (pathname.startsWith("/person/")) {
    return TITLES["/person/:id"];
  }

  return TITLES[pathname] ?? "Notonota";
}

export function AppLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="app-frame">
      <div className="app-surface">
        <ReviewNotificationManager />
        <header className="topbar">
          <div>
            <h1>notonota</h1>
            <p className="topbar__screen">{title}</p>
          </div>
        </header>
        <main className="screen-shell">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
