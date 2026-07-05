import { Link, useLocation } from "react-router-dom";

function Navbar() {

  const location = useLocation();

  const menus = [

    {
      name: "🏠 Dashboard",
      path: "/"
    },

    {
      name: "🚨 Incidents",
      path: "/requests"
    },

    {
      name: "🚑 Resources",
      path: "/resources"
    },

    {
      name: "🗺 Map",
      path: "/map"
    },

    {
      name: "📜 History",
      path: "/history"
    }

  ];

  return (

    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{
        background: "#0F172A",
        boxShadow: "0 8px 20px rgba(0,0,0,.15)"
      }}
    >

      <div className="container">

        <Link
          to="/"
          className="navbar-brand fw-bold"
          style={{
            fontSize: "1.5rem"
          }}
        >

          🚨 RescueSphere

        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >

          <span className="navbar-toggler-icon"></span>

        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <div className="navbar-nav ms-auto">

            {menus.map((menu) => (

              <Link
                key={menu.path}
                to={menu.path}
                className={`nav-link mx-2 fw-semibold ${
                  location.pathname === menu.path
                    ? "text-warning"
                    : "text-white"
                }`}
              >

                {menu.name}

              </Link>

            ))}

          </div>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;