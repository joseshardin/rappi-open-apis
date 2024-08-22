import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
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
        console.log(data.data); // Loguear los datos recibidos
        setLoading(false);
      } catch (error) {
        alert(
          `Error obteniendo los productos. Por favor, validar si tus credenciales son correctas o si el país es el indicado. Serás redirigido al login. Detalle del error: ${error.message}`
        );
        setLoading(false);
        navigate("/login");
      }
    };
    fetchProductos();
  }, [navigate]);

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
        Aquí estarán todos tus productos
        <div className="overflow-x-auto">
          <button className="btn btn-outline btn-primary">
            <Link to="/productos-crear">Añadir Productos</Link>
          </button>
          <button className="btn btn-outline btn-secundary ml-5">
            ♻ Actualizar
          </button>

          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Imagen</th>
                <th>Nombre</th>
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
                            src={
                              producto.images[0]?.path ||
                              "https://via.placeholder.com/150"
                            }
                            alt={producto.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{producto.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {producto.longDescription}
                    <br />
                  </td>
                  <td>{producto.ean}</td>
                  <td>{producto.sku}</td>
                  <td>{producto.longDescription}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.price}</td>
                  <td>{producto.sale_price}</td>
                  <td>
                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById("my_modal_3").showModal()
                      }
                    >
                      Detalles
                    </button>
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">JSON Completo!</h3>
                        <p className="py-4">
                          <strong>Nombre:</strong> {producto.name}
                          <br />
                          <strong>Descripción:</strong>{" "}
                          {producto.longDescription}
                          <br />
                          <strong>EAN:</strong> {producto.ean}
                          <br />
                          <strong>SKU:</strong> {producto.sku}
                          <br />
                          <strong>Stock:</strong> {producto.stock}
                          <br />
                          <strong>Precio:</strong> {producto.price}
                          <br />
                          <strong>Precio con Descuento:</strong>{" "}
                          {producto.sale_price}
                        </p>
                      </div>
                    </dialog>
                  </td>
                  <td>
                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
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
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          Press ESC key or click on ✕ button to close
                        </p>
                      </div>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
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
