import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return !!storedToken;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedExpirationDate = localStorage.getItem("expirationDate");
    if (storedToken && storedExpirationDate) {
      const expirationDate = new Date(storedExpirationDate);
      const updateTimer = () => {
        const now = new Date();
        const diff = expirationDate - now;
        if (diff > 0) {
          setTimeRemaining(diff);
        } else {
          setTimeRemaining(null);
          localStorage.removeItem("token");
          localStorage.removeItem("expirationDate");
          setIsAuthenticated(false);
        }
      };
      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalId);
    } else {
      setTimeRemaining(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleTokenUpdated = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("tokenUpdated", handleTokenUpdated);
    return () => {
      window.removeEventListener("tokenUpdated", handleTokenUpdated);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds) return "sin token";
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
    const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/login">Acceder</Link>
              </li>
              <li>
                <Link to="/inventario" href="/Inventario">
                  Inventario
                </Link>
                <ul className="p-2">
                  <li>
                    <Link to="/productos-crear" href="/InvCrearProducto">
                      Crear Producto
                    </Link>
                  </li>
                  <li>
                    <Link to="/tiendas" href="/Tiendas">
                      Tiendas disponibles
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/orders" href="/Orders">
                  Ordenes
                </Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">ERP Onboarding team</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/login" href="/Login">
                Acceder
              </Link>
            </li>
            <li>
              <details>
                <summary>Inventario</summary>
                <ul className="p-2">
                  <li>
                    <Link to="/inventario" href="/Inventario">
                      Tus productos
                    </Link>
                  </li>
                  <li>
                    <Link to="/productos-crear" href="/InvCrearProducto">
                      Crear Producto
                    </Link>
                  </li>
                  <li>
                    <Link to="/tiendas" href="/Tiendas">
                      Tiendas disponibles
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link to="/orders" href="/Orders">
                Ordenes
              </Link>
            </li>
            <li>
              <Link to="/payless" href="/Payless">
                Payless
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <p className="pr-5">
            Tu token expira en: {formatTimeRemaining(timeRemaining)}
          </p>
          <a className="btn" onClick={handleLogout}>
            Cerrar Sesion
          </a>
        </div>
      </div>
    </>
  );
};
