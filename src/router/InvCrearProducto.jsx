import { useState, useEffect } from "react";
import FileInput from "./components/FileInput";

export const InvCrearProducto = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
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

  const renderCategorySelect = (name, label, options) => {
    console.log(`Rendering ${name} with options:`, options);
    return (
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
  };

  const clearCategories = () => {
    setCategories({
      category1: "",
      category2: "",
      category3: "",
    });
    setSubCategories({});
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
            {categories.category1 &&
              subCategories[categories.category1]?.length > 0 &&
              renderCategorySelect(
                "category2",
                "Selecciona Subcategoría 1",
                subCategories[categories.category1] || []
              )}
            {categories.category2 &&
              subCategories[categories.category2]?.length > 0 &&
              renderCategorySelect(
                "category3",
                "Selecciona Subcategoría 2",
                subCategories[categories.category2] || []
              )}
            <button
              className="btn btn-outline btn-primary"
              onClick={handleNext}
              disabled={!categories.category1}
            >
              Continuar
            </button>
            <button
              className="btn btn-xs btn-outline btn-secondary"
              onClick={clearCategories}
            >
              Limpiar categorías
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
      </div>
    </div>
  );
};
