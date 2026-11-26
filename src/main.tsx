import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/CardEffects.css";
import AuthProvider from "./context/AuthProvider";
import { ProductSoundProvider } from "./context/ProductSoundProvider";
import App from "./App";
import ToastProvider from "./context/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductSoundProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ProductSoundProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
