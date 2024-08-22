import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavBar } from "./router/components/NavBar";
import { Login } from "./router/Login";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { Inventario } from "./router/Inventario";
import { Orders } from "./router/Orders";
import { InvCrearProducto } from "./router/InvCrearProducto";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/inventario" element={<Inventario></Inventario>}></Route>
        <Route path="/orders" element={<Orders></Orders>}></Route>
        <Route
          path="/productos-crear"
          element={<InvCrearProducto></InvCrearProducto>}
        ></Route>
        <Route path="/*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
