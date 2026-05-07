import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Strutture", to: "/strutture" },
  { label: "Spa", to: "/spa" },
  { label: "Galleria", to: "/galleria" },
  { label: "Esperienze", to: "/esperienze" },
  { label: "Recensioni", to: "/recensioni" },
  { label: "Contatti", to: "/contatti" },
];

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-bnb sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-bnb" to="/">
          <img className="logoFace" src="/logo_no_background.png" alt="logo" />
          Le Mura degli Angeli
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="mainNav"
        >
          <ul className="navbar-nav align-items-center gap-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to={item.to}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
