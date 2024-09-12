import { useState, useEffect } from "react";
import FileInput from "./components/FileInput";
import { useNavigate, Link } from "react-router-dom";

export const InvCrearProducto = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });
  const [categoryNames, setCategoryNames] = useState({
    category1: "",
    category2: "",
    category3: "",
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const [productInfo, setProductInfo] = useState({
    name: "",
    ean: "",
    sku: "",
    description: "",
    presentationQuantity: 1,
    referenceUnit: "Und",
    type: "U",
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  });

  const [imageUrls, setImageUrls] = useState([{ path: "", position: 1 }]);
  const [variations, setVariations] = useState([]);
  const [hasVariation, setHasVariation] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error del servidor
  const [stores, setStores] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [productCreated, setProductCreated] = useState(null);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const countryURL = localStorage.getItem("storedURL");
        if (!token || !countryURL) {
          throw new Error(
            "Token o URL del país no encontrados. ¿Estás loggeado? "
          );
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
          throw new Error(
            "Error obteniendo las categorías principales. Posiblemente error de servidor. Cierra sesión e intenta logearte de nuevo"
          );
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

        // acá reenviar a login!!!!
        navigate("/inventario");
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

    // Obtener el nombre de la categoría seleccionada
    const selectedCategory = mainCategories.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setCategoryNames((prev) => ({
        ...prev,
        [name]: selectedCategory.name,
      }));
    }
  };

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateCategories()) {
        setStep(step + 1);
      }
    } else {
      if (validateForm()) {
        setStep(step + 1);
      }
    }
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

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index].path = value;
    setImageUrls(newImageUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, { path: "", position: imageUrls.length + 1 }]);
  };

  const removeImageUrl = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const validateCategories = () => {
    if (
      categories.category1 &&
      subCategories[categories.category1]?.length > 0 &&
      !categories.category2
    ) {
      alert("Debes seleccionar una subcategoría.");
      return false;
    }

    if (
      categories.category2 &&
      subCategories[categories.category2]?.length > 0 &&
      !categories.category3
    ) {
      alert("Debes seleccionar una subcategoría adicional.");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const eanRegex = /^\d{13}$/; // EAN debe ser un número de 13 dígitos
    const skuRegex = /^[a-zA-Z0-9]+/; // SKU no debe comenzar con caracteres especiales

    if (productInfo.ean && !eanRegex.test(productInfo.ean)) {
      alert("EAN debe ser un número de 13 dígitos.");
      return false;
    }

    if (!skuRegex.test(productInfo.sku)) {
      alert("SKU no debe comenzar con caracteres especiales.");
      return false;
    }

    if (
      productInfo.minQuantity < 0 ||
      productInfo.maxQuantity < 0 ||
      productInfo.stepQuantity < 0
    ) {
      alert("Las cantidades no pueden ser negativas.");
      return false;
    }

    if (
      step === 2 &&
      imageUrls.filter((url) => url.path.trim() !== "").length === 0
    ) {
      alert("Debes proporcionar al menos una URL de imagen válida.");
      return false;
    }

    return true;
  };

  const createProduct = async () => {
    const token = localStorage.getItem("token");
    const countryURL = localStorage.getItem("storedURL");

    if (!token || !countryURL) {
      alert("Token o URL del país no encontrados.");
      return;
    }

    const productData = {
      category_id: Number(
        categories.category3 || categories.category2 || categories.category1
      ),
      name: productInfo.name, // Nombre del producto
      description: productInfo.description,
      has_variation: hasVariation,
      presentation: {
        quantity: productInfo.presentationQuantity,
        unitType: productInfo.referenceUnit,
      },
      sellType: {
        type: productInfo.type,
        minQuantity: productInfo.minQuantity,
        maxQuantity: productInfo.maxQuantity,
        stepQuantity: productInfo.stepQuantity,
      },
      product: hasVariation
        ? [
            {
              sku: productInfo.sku,
              ean: productInfo.ean,
              name: productInfo.name, // Nombre del producto
              images: imageUrls.filter((url) => url.path.trim() !== ""),
              attributes: {},
            },
            ...variations.map((variation) => ({
              sku: variation.sku,
              ean: variation.ean,
              name: productInfo.name, // Nombre del producto
              images: variation.images.filter((url) => url.path.trim() !== ""),
              attributes: {},
            })),
          ]
        : [
            {
              sku: productInfo.sku,
              ean: productInfo.ean,
              name: productInfo.name, // Nombre del producto
              images: imageUrls.filter((url) => url.path.trim() !== ""),
              attributes: {},
            },
          ],
    };

    try {
      const response = await fetch(
        `${countryURL}/api/open-api/v1/catalog/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creando el producto.");
      }

      const data = await response.json();
      console.log("Producto creado exitosamente:", data);
      setCreationStatus("success");
      setProductCreated(data.data);
      setStep(3);
      fetchStores();
    } catch (error) {
      console.error("Error detallado:", error);
      setCreationStatus("error");
      setErrorMessage(error.message);
    }
  };

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const countryURL = localStorage.getItem("storedURL");
      if (!token || !countryURL) {
        throw new Error("Token o URL del país no encontrados");
      }

      const response = await fetch(
        `${countryURL}/api/open-api/v1/catalog/stores`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error obteniendo las tiendas");
      }

      const data = await response.json();
      setStores(data.data);
    } catch (error) {
      console.error("Error detallado:", error);
      alert(
        `Error obteniendo las tiendas. Detalle del error: ${error.message}`
      );
    }
  };

  const associateProductWithStore = async (
    storeId,
    productId,
    price,
    salePrice,
    stock
  ) => {
    const token = localStorage.getItem("token");
    const countryURL = localStorage.getItem("storedURL");

    if (!token || !countryURL) {
      alert("Token o URL del país no encontrados.");
      return;
    }

    const associationData = {
      id: productId,
      price: price,
      sale_price: salePrice,
      stock: stock,
    };

    try {
      const response = await fetch(
        `${countryURL}/api/open-api/v1/catalog/stores/${storeId}/inventory`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(associationData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error asociando el producto.");
      }

      const data = await response.json();
      console.log("Producto asociado exitosamente:", data);
      setCreationStatus("success");
      setTimeout(() => {
        navigate("/inventario");
      }, 10000);
    } catch (error) {
      console.error("Error detallado:", error);
      setCreationStatus("error");
      setErrorMessage(error.message);
    }
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        sku: "",
        ean: "",
        images: [{ path: "", position: 1 }],
        attributes: {},
      },
    ]);
  };

  const removeVariation = (index) => {
    const newVariations = [...variations];
    newVariations.splice(index, 1);
    setVariations(newVariations);
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const handleVariationImageUrlChange = (variationIndex, imageIndex, value) => {
    const newVariations = [...variations];
    newVariations[variationIndex].images[imageIndex].path = value;
    setVariations(newVariations);
  };

  const addVariationImageUrl = (variationIndex) => {
    const newVariations = [...variations];
    newVariations[variationIndex].images.push({
      path: "",
      position: newVariations[variationIndex].images.length + 1,
    });
    setVariations(newVariations);
  };

  const removeVariationImageUrl = (variationIndex, imageIndex) => {
    const newVariations = [...variations];
    newVariations[variationIndex].images.splice(imageIndex, 1);
    setVariations(newVariations);
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
                value={productInfo.name}
                onChange={handleProductInfoChange}
                name="name"
              />
              <input
                type="text"
                placeholder="EAN"
                className="input input-bordered input-primary w-full max-w-xs"
                value={productInfo.ean}
                onChange={handleProductInfoChange}
                name="ean"
              />
              <input
                type="text"
                placeholder="SKU"
                className="input input-bordered input-primary w-full max-w-xs"
                value={productInfo.sku}
                onChange={handleProductInfoChange}
                name="sku"
              />
            </div>
            <div className="flex gap-3">
              <div>
                <label className="label">
                  <span className="label-text">
                    Presentación del producto (Und)
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={productInfo.presentationQuantity}
                  onChange={handleProductInfoChange}
                  name="presentationQuantity"
                  min="1"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Medida de referencia</span>
                </label>
                <select
                  className="select select-primary w-full max-w-xs"
                  value={productInfo.referenceUnit}
                  onChange={handleProductInfoChange}
                  name="referenceUnit"
                >
                  <option value="Und">Und</option>
                  <option value="Kg">Kg</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                  <option value="m">m</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>
            <textarea
              placeholder="Descripción del producto"
              className="input input-bordered input-primary w-full max-w-xs"
              value={productInfo.description}
              onChange={handleProductInfoChange}
              name="description"
            />
            <div className="flex gap-3">
              <div>
                <label className="label">
                  <span className="label-text">Tipo de venta</span>
                </label>
                <select
                  className="select select-primary w-full max-w-xs"
                  value={productInfo.type}
                  onChange={handleProductInfoChange}
                  name="type"
                >
                  <option value="U">U</option>
                  <option value="WB">WB</option>
                  <option value="WW">WW</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Cantidad mínima</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={productInfo.minQuantity}
                  onChange={handleProductInfoChange}
                  name="minQuantity"
                  min="1"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">
                    Cantidad máxima de compra en orden
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={productInfo.maxQuantity}
                  onChange={handleProductInfoChange}
                  name="maxQuantity"
                  min="1"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Paso de cantidad</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={productInfo.stepQuantity}
                  onChange={handleProductInfoChange}
                  name="stepQuantity"
                  min="1"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Imágenes del producto</h2>
            <p>Puedes subir hasta 4 imágenes</p>
            <div
              tabIndex={0}
              className="bg-primary text-primary-content focus:bg-secondary focus:text-secondary-content collapse"
            >
              <div className="collapse-title">Recomendaciones (Clic):</div>
              <div className="collapse-content">
                <div className="mb-4">
                  <h4 className="font-bold">Cantidad mínima a vender</h4>
                  <p>
                    Define la cantidad mínima que un cliente puede comprar.
                    <br />
                    (Campo numérico):
                    <br />
                    Ejemplo: 1 (unidad), 100 (g), etc.
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold">Cantidad máxima a vender</h4>
                  <p>
                    Define la cantidad máxima que un cliente puede comprar en
                    una sola compra.
                    <br />
                    (Campo numérico):
                    <br />
                    Ejemplo: 10 (unidades), 1000 (g), etc.
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold">Incremento de cantidad (Paso)</h4>
                  <p>
                    Define en qué incrementos se puede aumentar la cantidad al
                    añadir al carrito.
                    <br />
                    (Campo numérico con explicación):
                    <br />
                    Ejemplo: Si el paso es 100 g, el cliente solo puede agregar
                    de 100 g en 100 g.
                  </p>
                </div>
              </div>
            </div>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={url.path}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                />
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => removeImageUrl(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              className="btn btn-outline btn-primary"
              onClick={addImageUrl}
            >
              Añadir otra URL
            </button>
            <button
              className="btn btn-outline btn-accent"
              onClick={() => setHasVariation(!hasVariation)}
            >
              ¿Necesitas variaciones?
            </button>
            {hasVariation && (
              <>
                <h3 className="text-xl font-bold">Variaciones</h3>
                {variations.map((variation, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="SKU de la variación"
                      className="input input-bordered input-primary w-full max-w-xs"
                      value={variation.sku}
                      onChange={(e) =>
                        handleVariationChange(index, "sku", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="EAN de la variación"
                      className="input input-bordered input-primary w-full max-w-xs"
                      value={variation.ean}
                      onChange={(e) =>
                        handleVariationChange(index, "ean", e.target.value)
                      }
                    />
                    {variation.images.map((imageUrl, imageIndex) => (
                      <div key={imageIndex} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="URL de la imagen"
                          className="input input-bordered input-primary w-full max-w-xs"
                          value={imageUrl.path}
                          onChange={(e) =>
                            handleVariationImageUrlChange(
                              index,
                              imageIndex,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn btn-outline btn-error"
                          onClick={() =>
                            removeVariationImageUrl(index, imageIndex)
                          }
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={() => addVariationImageUrl(index)}
                    >
                      Añadir otra URL de imagen
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => removeVariation(index)}
                    >
                      Eliminar variación
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-primary"
                  onClick={addVariation}
                >
                  Añadir otra variación
                </button>
              </>
            )}
            <button
              className="btn btn-outline btn-secundary"
              onClick={handleBack}
            >
              Volver
            </button>

            <button className="btn btn-success" onClick={createProduct}>
              Crear producto
            </button>
            {creationStatus === "success" && (
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
            )}
            {creationStatus === "error" && (
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
                <span className="text-red-800">
                  Ha ocurrido un error: {errorMessage}
                </span>
                <Link
                  to="/tus-productos"
                  className="btn btn-outline btn-error ml-4"
                >
                  Volver a tus productos
                </Link>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold">Asociación de Productos</h2>
            <p>Asocia el producto a tu tienda</p>
            {productCreated && (
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
                <div className="ml-4">
                  <p>Nombre: {productCreated.name}</p>
                  <p>SKU: {productCreated.sku}</p>
                  <p>EAN: {productCreated.ean}</p>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio (moneda local)</th>
                    <th>Precio con Descuento (moneda local)</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox-xs checkbox-primary"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStores([...selectedStores, store.id]);
                            } else {
                              setSelectedStores(
                                selectedStores.filter((id) => id !== store.id)
                              );
                            }
                          }}
                        />
                      </th>
                      <td>{store.id}</td>
                      <td>{store.name}</td>
                      <td>
                        <input
                          type="number"
                          placeholder="Stock"
                          className="input input-bordered input-primary w-full max-w-xs"
                          onChange={(e) => {
                            store.stock = e.target.value;
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Precio"
                          className="input input-bordered input-primary w-full max-w-xs"
                          onChange={(e) => {
                            store.price = e.target.value;
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Precio con Descuento"
                          className="input input-bordered input-primary w-full max-w-xs"
                          onChange={(e) => {
                            store.sale_price = e.target.value;
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-active btn-secondary"
              onClick={async () => {
                const promises = selectedStores.map(async (storeId) => {
                  const store = stores.find((s) => s.id === storeId);
                  if (store) {
                    await associateProductWithStore(
                      storeId,
                      productCreated.id,
                      store.price,
                      store.sale_price,
                      store.stock
                    );
                  } else {
                    console.error(`Tienda con ID ${storeId} no encontrada.`);
                  }
                });

                try {
                  await Promise.all(promises);
                  alert("Productos asociados correctamente");
                } catch (error) {
                  console.error("Error asociando productos:", error);
                  alert(
                    "Error asociando productos. Por favor, inténtalo de nuevo."
                  );
                }
              }}
            >
              Asociar producto a tiendas
            </button>
            <button
              className="btn btn-outline btn-secundary"
              onClick={() => {
                navigate("/inventario");
              }}
            >
              Lo asociaré luego
            </button>

            {creationStatus === "success" && (
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
                  Producto asociado correctamente (volviendo en 10s).
                </span>
              </div>
            )}
            {creationStatus === "error" && (
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
            )}
          </>
        )}

        {step === 4 && (
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

        {step === 5 && (
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

export default InvCrearProducto;
