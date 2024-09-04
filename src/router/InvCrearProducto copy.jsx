import { Link } from "react-router-dom";
import FileInput from "./components/FileInput";
import { useState, useEffect } from "react";

export const InvCrearProducto = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const countryURL = localStorage.getItem("storedURL");
        if (!token || !countryURL) {
          throw new Error("Token o URL del país no encontrados");
        }

        const response = await fetch(
          `${countryURL}/api/open-api/v1/catalog/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error obteniendo las categorías principales");
        }

        const data = await response.json();
        setMainCategories(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error detallado:", error);
        alert(
          `Error obteniendo las categorías principales. Detalle del error: ${error.message}`
        );
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (categories.category1) {
      fetchSubCategories(categories.category1);
    }
  }, [categories.category1]);

  useEffect(() => {
    if (categories.category2) {
      fetchSubCategories(categories.category2);
    }
  }, [categories.category2]);

  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const countryURL = localStorage.getItem("storedURL");
      if (!token || !countryURL) {
        throw new Error("Token o URL del país no encontrados");
      }

      const response = await fetch(
        `${countryURL}/api/open-api/v1/catalog/taxonomy/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error obteniendo las subcategorías");
      }

      const data = await response.json();
      setSubCategories((prev) => ({
        ...prev,
        [categoryId]: data.data[0]?.childs || [],
      }));
    } catch (error) {
      console.error("Error detallado:", error);
      alert(
        `Error obteniendo las subcategorías. Detalle del error: ${error.message}`
      );
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategories((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const renderCategorySelect = (name, label, options) => (
    <select
      className="select select-primary w-full max-w-xs"
      name={name}
      value={categories[name]}
      onChange={handleCategoryChange}
      disabled={options.length === 0}
    >
      <option disabled value="">
        {label}
      </option>
      {options.length === 0 ? (
        <option value="" disabled>
          No hay subcategorías
        </option>
      ) : (
        options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))
      )}
    </select>
  );

  const fetchAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const countryURL = localStorage.getItem("storedURL");
      if (!token || !countryURL) {
        throw new Error("Token o URL del país no encontrados");
      }

      const response = await fetch(
        `${countryURL}/api/open-api/v1/catalog/category-tree`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error obteniendo todas las categorías");
      }

      const data = await response.json();
      setAllCategories(data.data);
    } catch (error) {
      console.error("Error detallado:", error);
      alert(
        `Error obteniendo todas las categorías. Detalle del error: ${error.message}`
      );
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

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
      <div className="flex flex-col min-h-screen justify-center gap-9 bg-white px-9">
        <div className="flex justify-center items-center flex-col gap-3">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold">
                Elije la categoría de tu producto
              </h2>
              {renderCategorySelect(
                "category1",
                "Selecciona Categoría",
                mainCategories
              )}
              {renderCategorySelect(
                "category2",
                "Selecciona Subcategoría 1",
                categories.category1 ? subCategories[categories.category1] : []
              )}
              {renderCategorySelect(
                "category3",
                "Selecciona Subcategoría 2",
                categories.category2 ? subCategories[categories.category2] : []
              )}
              <button
                className="btn btn-outline btn-primary"
                onClick={handleNext}
                disabled={!categories.category3}
              >
                Continuar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold">
                Completa la información del producto
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="EAN"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Marca del producto"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="EAN"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <textarea
                placeholder="Descripción del producto"
                className="input input-bordered input-primary w-full max-w-xs"
              />
              <div className="flex gap-3">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={handleNext}
                >
                  Continuar
                </button>
                <button
                  className="btn btn-outline btn-secundary"
                  onClick={handleBack}
                >
                  Volver
                </button>
              </div>
            </>
          )}

          {/* Agrega más pasos según sea necesario */}

          {step === 6 && (
            <>
              <h2 className="text-2xl font-bold">Imágenes del producto</h2>
              <p>Puedes subir hasta 4 imágenes</p>
              <FileInput />
              <button className="btn btn-success">Crear producto</button>
              <button
                className="btn btn-outline btn-secundary"
                onClick={handleBack}
              >
                Volver
              </button>
            </>
          )}

          {/* You can open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn btn-xs"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            Ver JSON con categorías
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Todas las Categorías</h3>
              <pre>{JSON.stringify(allCategories, null, 2)}</pre>
            </div>
          </dialog>
          <div className="flex gap-3">
            <button className="btn btn-outline btn-primary">
              <Link to="/#" href="/#">
                Continuar
              </Link>
            </button>
            <button className="btn btn-outline btn-secundary">
              <Link to="/#" href="/#">
                Volver
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-bold">
            Completa la información del producto
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nombre del producto"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="EAN"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="SKU"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Marca del producto"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="EAN"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>
          <textarea
            placeholder="Descripción del producto"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <div className="flex gap-3">
            <button className="btn btn-outline btn-primary">
              <Link to="/#" href="/#">
                Continuar
              </Link>
            </button>
            <button className="btn btn-outline btn-secundary">
              <Link to="/#" href="/#">
                Volver
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-bold">Formato de venta</h2>
          <select className="select select-primary w-full max-w-xs">
            <option disabled selected>
              Selecciona Categoría
            </option>
            <option>Por llenar</option>
          </select>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Cantidad"
              className="input input-bordered input-primary w-full max-w-xs"
            />

            <select className="select select-primary w-full max-w-xs">
              <option disabled selected>
                Unidad de venta
              </option>
              <option>Por llenar</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline btn-primary">
              <Link to="/#" href="/#">
                Continuar
              </Link>
            </button>
            <button className="btn btn-outline btn-secundary">
              <Link to="/#" href="/#">
                Volver
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-bold">¿Tiene variaciones?</h2>
          <p>Variaciones: blablabla</p>
          <div className="flex gap-3">
            <Link to="/#" className="btn btn-outline btn-primary">
              Sí
            </Link>

            <button className="btn btn-outline btn-primary">
              <Link to="/#" href="/#">
                No
              </Link>
            </button>
          </div>
          <button className="btn btn-outline btn-secundary">
            <Link to="/#" href="/#">
              Volver
            </Link>
          </button>
        </div>

        <div className="flex items-center flex-col gap-3">
          <h2 className="text-2xl font-bold">Imágenes del producto</h2>
          <p>Puedes subir hasta 4 imágenes</p>

          <div
            tabIndex={0}
            className="bg-primary text-primary-content focus:bg-secondary focus:text-secondary-content collapse"
          >
            <div className="collapse-title">Recomendaciones:</div>
            <div className="collapse-content">
              <p>
                - Nombra las imágenes con el EAN o SKU del producto <br /> -
                Formato PNG o JPG - Menor a 1MB 600*600 píxeles <br /> -
                Adicional: Sin marcas de agua y debe verse todo el producto.
              </p>
            </div>
          </div>
          <FileInput />

          <button className="btn btn-success">
            <Link to="/#" href="/#">
              Crear producto
            </Link>
          </button>
          <button className="btn btn-outline btn-secundary">
            <Link to="/#" href="/#">
              Volver
            </Link>
          </button>

          <div className="flex items-center flex-col gap-3">
            <div className="bg-green-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
              <svg
                viewBox="0 0 24 24"
                className="text-green-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <span className="text-green-800">
                Producto creado correctamente
              </span>
            </div>
            <h2 className="text-2xl font-bold">Asociación de Productos</h2>
            <p>Asocia el producto a tu tienda</p>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Precio con Descuento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox-xs checkbox-primary"
                      />
                    </th>
                    <td>SKU</td>
                    <td>Nombre tienda</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Colocar stock"
                        className="input input-bordered input-primary w-full max-w-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Colocar stock"
                        className="input input-bordered input-primary w-full max-w-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Colocar stock"
                        className="input input-bordered input-primary w-full max-w-xs"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="btn btn-active btn-secondary">
              <Link to="/#" href="/#">
                Asociar producto a tiendas
              </Link>
            </button>
            <button className="btn btn-outline btn-secundary">
              <Link to="/#" href="/#">
                Lo asociaré luego
              </Link>
            </button>
          </div>
          <button className="btn">
            <span className="loading loading-spinner"></span>
            loading
          </button>
          <div className="bg-green-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <span className="text-green-800">
              Producto asociado correctamente (volviendo en 3s).
            </span>
          </div>
          <div className="bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
            <svg
              viewBox="0 0 24 24"
              className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
            >
              <path
                fill="currentColor"
                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
              ></path>
            </svg>
            <span className="text-red-800">Ha ocurrido un error!</span>
          </div>
        </div>
      </div>
    </>
  );
};