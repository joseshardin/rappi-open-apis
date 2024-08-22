import { Link } from "react-router-dom";

export const Orders = () => {
  return (
    <>
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>

      <div className="container mx-auto px-4">
        Aquí estarán todos tus productos{" "}
      </div>
      <ul className="steps">
        <li className="step step-primary">Register</li>
        <li className="step step-primary">Choose plan</li>
        <li className="step">Purchase</li>
        <li className="step">Receive Product</li>
      </ul>

      <div className="container mx-auto px-4">
        Aquí estarán todos tus productos
        <div className="overflow-x-auto">
          <button className="btn btn-outline btn-primary">
            <Link Link to="/productos-crear" href="/InvCrearProducto">
              Añadir Productos
            </Link>
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
              {/* row 1 */}
              <tr>
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
                          src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                    </div>
                  </div>
                </td>
                <td>
                  Zemlak, Daniel and Leannon
                  <br />
                </td>
                <td>Purple</td>
                <td>Purple</td>
                <td>Purple</td>
                <td>Purple</td>
                <td>Purple</td>
                <td>Purple</td>
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
                      <h3 className="font-bold text-lg">Hello!</h3>
                      <p className="py-4">
                        Press ESC key or click on ✕ button to close
                      </p>
                    </div>
                  </dialog>
                </td>
                <td>
                  {/* You can open the modal using document.getElementById('ID').showModal() method */}
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }
                  >
                    Asociar
                  </button>
                  <dialog id="my_modal_3" className="modal">
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
