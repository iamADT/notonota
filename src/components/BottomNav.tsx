import { NavLink } from "react-router-dom";

const links = [
  { to: "/saved", label: "Saved" },
  { to: "/capture", label: "Capture" }
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__track">
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) =>
              isActive ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"
            }
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
