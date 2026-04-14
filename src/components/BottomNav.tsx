import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/saved", label: "Saved" },
  { to: "/add-name", label: "Add name" }
];

export function BottomNav() {
  const location = useLocation();

  function isLinkActive(path: string) {
    if (path === "/add-name") {
      return location.pathname === "/add-name" || location.pathname === "/add-name-v2";
    }

    if (path === "/saved") {
      return (
        location.pathname === "/saved" ||
        location.pathname === "/review" ||
        location.pathname.startsWith("/person/")
      );
    }

    return location.pathname === path;
  }

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__track">
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={isLinkActive(link.to) ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
