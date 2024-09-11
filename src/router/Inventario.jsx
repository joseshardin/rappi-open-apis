import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Colocar que estos productos se muestran porque están asociados a una tienda.

export const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const countryURL = localStorage.getItem("storedURL");
        if (!token || !countryURL) {
          throw new Error("Token o URL del país no encontrados");
        }

        const response = await fetch(
          `${countryURL}/api/open-api/v1/catalog/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              limit: "50",
              offset: "0",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error obteniendo los productos"
          );
        }

        const data = await response.json();
        setProductos(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error detallado:", error);
        alert(
          `Error obteniendo los productos. Serás redirigido al login. Detalle del error: ${error.message}`
        );
        setLoading(false);
        navigate("/login");
      }
    };
    fetchProductos();
  }, [navigate]);

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "...";
  };

  const handleDetailsClick = (producto) => {
    setSelectedProduct(producto);
    document.getElementById("my_modal_3").showModal();
  };

  if (loading) {
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <button className="btn btn-outline btn-primary">
            <Link to="/productos-crear">Añadir Productos</Link>
          </button>
          <button className="btn btn-outline btn-secondary ml-5">
            ♻ Actualizar
          </button>

          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Imagen / Nombre</th>
                <th>EAN</th>
                <th>SKU</th>
                <th>Descripción</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Precio con Desc.</th>
                <th>Detalles / Editar</th>
                <th>Asociar a tienda</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={producto.images[0]?.path || "No disponible"}
                            alt={producto.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{producto.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{producto.ean || "No disponible"}</td>
                  <td>{producto.sku || "No disponible"}</td>
                  <td>
                    {truncateText(producto.longDescription, 50) ||
                      "No disponible"}
                  </td>
                  <td>{producto.stock || "No disponible"}</td>
                  <td>{producto.price || "No disponible"}</td>
                  <td>{producto.price_desc || "No disponible"}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => handleDetailsClick(producto)}
                    >
                      Detalles
                    </button>
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">JSON Completo!</h3>
                        <textarea
                          className="w-full h-64 p-2 border rounded mt-4"
                          value={JSON.stringify(selectedProduct, null, 2)}
                          readOnly
                        />
                      </div>
                    </dialog>
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById("my_modal_4").showModal()
                      }
                    >
                      Asociar
                    </button>
                    <dialog id="my_modal_4" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Sección pendiente de trabajar</p>
                      </div>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>
                  <button className="btn btn-outline btn-error">
                    Eliminar producto(s) seleccionado(s)
                  </button>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};
