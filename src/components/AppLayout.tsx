import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

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
        <header className="topbar">
          <div>
            <p className="topbar__eyebrow">Names Memory App</p>
            <h1>{title}</h1>
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

