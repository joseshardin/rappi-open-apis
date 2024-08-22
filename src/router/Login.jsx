import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [client_id, setClient_id] = useState("");
  const [client_secret, setClient_secret] = useState("");
  const [country, setCountry] = useState("");
  const [token, setToken] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const storedExpirationDate = localStorage.getItem("expirationDate");
      const expirationDate = new Date(storedExpirationDate);
      if (expirationDate > new Date()) {
        setToken(storedToken);
        setExpirationDate(expirationDate);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        alert("Token eliminado por tiempo. Vuelvo a loggearte");
      }
    }
  }, []);

  const countryURL = {
    Colombia: "https://services.grability.rappi.com",
    Brasil: "https://services.rappi.com.br",
    Chile: "https://services.rappi.cl",
    Argentina: "https://services.rappi.com.ar",
    CostaRica: "https://services.rappi.co.cr",
    Ecuador: "https://services.rappi.com.ec",
    Mexico: "https://services.mxgrability.rappi.com",
    Peru: "https://services.rappi.pe",
    Uruguay: "https://services.rappi.com.uy",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${countryURL[country]}/api/open-api/login`;
    const urlBase = `${countryURL[country]}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "did=s%3Av0%3A1bf03870-d71f-11ee-ba77-f1963c5e274c.iGr%2Bzlx4fbj2Ra59ZrRQDOIrFAm%2FknAKVD%2B7TT4IPXs; did_compat=s%3Av0%3A1bf03870-d71f-11ee-ba77-f1963c5e274c.iGr%2Bzlx4fbj2Ra59ZrRQDOIrFAm%2FknAKVD%2B7TT4IPXs",
        },
        body: JSON.stringify({ client_id, client_secret }),
        redirect: "follow",
      });
      if (!response.ok) {
        throw new Error("Falló la autenticación");
      }

      const data = await response.json();
      console.log("Bien, lograste loggearte crack🌞", data.access_token);
      const token = data.access_token;

      const expiresIn = 60400 * 1000; // 24 hrs en mili sec
      const expirationTime = new Date(Date.now() + expiresIn);
      localStorage.setItem("storedURL", urlBase);

      localStorage.setItem("token", token);
      localStorage.setItem("expirationDate", expirationTime.toISOString());
      localStorage.setItem("country", country);
      setToken(token);
      setExpirationDate(expirationTime);

      navigate("/inventario");

      // notificar token actualizado
      window.dispatchEvent(new Event("tokenUpdated"));
    } catch (error) {
      console.log(error);
      alert(
        "Algo falló. Valida si tus credenciales son correctas o el país 💀"
      );
    }
  };

  const formatExpirationDate = (date) => {
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (token) {
    return (
      <>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">
                Bienvenido al ERP Onboarding
              </h1>
              <h2 className="text-2xl font-bold">v1.0</h2>
              <p className="py-6">
                Si tienes alguna consulta envíame un mensaje a{" "}
                <a href="mailto:joseruiz.sh@gmail.com?subject=Quiero%20contactar%20contigo&body=Hola%20Jos%C3%A9!%0D%0ASoy...">
                  jose.shardin@rappi.com
                </a>
              </p>
              <div className="mockup-code">
                <pre data-prefix="🔑" className="text-warning">
                  <code>Token</code>
                </pre>
                <pre data-prefix=">">
                  <code>{token} </code>
                </pre>
                <pre data-prefix="📅" className="text-success">
                  <code>Fecha finalización token:</code>
                </pre>
                <pre data-prefix=">">
                  <code>{formatExpirationDate(expirationDate)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Rappi Open Apis!</h1>
              <br />
              <h2 className="text-1xl font-bold">
                👀 Pregunta por tus credenciales al team de Onboarding
              </h2>
              <p className="py-6">
                Este es simulador ERP que te permite testar las APIS de Rappi
                (Open Orders, Open Catalog, Open Inventory) y probar el
                funcionamiento del lado del cliente 🤙🏻
              </p>
              <Link to="/funciones" className="btn btn-outline btn-secundary">
                Ver todas las funciones
              </Link>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <form className="card-body" onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">País</span>
                  </label>
                  <select
                    className="select select-primary w-full max-w-xs"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option disabled selected>
                      Selecciona un país
                    </option>
                    <option value="Colombia">Colombia</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Chile">Chile</option>
                    <option value="Argentina">Argentina</option>
                    <option value="CostaRica">CostaRica</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Peru">Peru</option>
                    <option value="Uruguay">Uruguay</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Client</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu client Rappi"
                    className="input input-bordered"
                    value={client_id}
                    onChange={(e) => {
                      setClient_id(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Secret</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu secret Rappi"
                    className="input input-bordered"
                    value={client_secret}
                    onChange={(e) => {
                      setClient_secret(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary">Ingresar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
};
