import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ReviewNotificationManager } from "./ReviewNotificationManager";

export function AppLayout() {
  return (
    <div className="app-frame">
      <div className="app-surface">
        <ReviewNotificationManager />
        <header className="topbar">
          <div>
            <h1>notonota</h1>
            <p className="topbar__screen">remember who you met</p>
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
