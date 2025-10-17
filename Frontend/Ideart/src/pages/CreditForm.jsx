import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePaymentUnified from "../hooks/usePayment.jsx";
import { useShoppingCart } from "../hooks/useFetchShoppingCart.jsx";
import "../css/Checkout.css";

const CreditForm = () => {
  const navigate = useNavigate();

  const {
    formData,
    formDataTarjeta,
    step,
    handleChangeData,
    handleChangeTarjeta,
    handleFirstStep,
    handleFinishPayment,
    loading,
    accessToken,
    limpiarFormulario,
  } = usePaymentUnified();

  const { cart, loading: loadingCart, clearCart, refreshCart } = useShoppingCart(); // Asegúrate que tu hook tenga clearCart
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // Set monto from cart
  useEffect(() => {
    if (cart && typeof cart.total === "number") {
      const montoActual = watch("monto");
      const montoCarrito = cart.total.toFixed(2);
      if (montoActual !== montoCarrito) {
        setValue("monto", montoCarrito);
        handleChangeData({ target: { name: "monto", value: cart.total } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, setValue, watch]);

  // Sync formData with react-hook-form
  useEffect(() => {
    setValue("nombre", formData?.nombre || "");
    setValue("apellido", formData?.apellido || "");
    setValue("email", formData?.email || "");
    setValue("ciudad", formData?.ciudad || "");
    setValue("direccion", formData?.direccion || "");
    setValue("telefono", formData?.telefono || "");
  }, [formData, setValue]);

  // Sync tarjeta data
  useEffect(() => {
    setValue("numeroTarjeta", formDataTarjeta?.numeroTarjeta || "");
    setValue("expiry", formDataTarjeta?.expiry || "");
    setValue("cvv", formDataTarjeta?.cvv || "");
  }, [formDataTarjeta, setValue]);

  // Animación: nombre y apellido juntos
  const cardName =
    (watch("nombre") ? watch("nombre") : "") +
    (watch("apellido") ? " " + watch("apellido") : "");

  // Toast helpers
  const showSuccess = (msg) => toast.success(msg, { position: "top-right" });
  const showError = (msg) => toast.error(msg, { position: "top-right" });

  // Submit handler
  const onSubmit = async () => {
    console.log("onSubmit ejecutado, step:", step);
    try {
      if (step === 1) {
        await handleFirstStep();
      } else if (step === 2) {
        await handleFinishPayment();
        if (typeof clearCart === "function") {
          console.log("Llamando a clearCart");
          await clearCart();
          if (typeof refreshCart === "function") await refreshCart();
        }
        showSuccess("Pago realizado correctamente");
        // Ya NO navegues aquí, espera a step 3
      }
    } catch (err) {
      showError("Error al procesar el pago: " + (err?.message || "Intenta de nuevo"));
    }
  };

  // Navega solo cuando step sea 3
  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        navigate("/");
      }, 1200);
    }
  }, [step, navigate]);

  if (loadingCart) {
    return <p className="cart-page-message">Cargando total del carrito...</p>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <ToastContainer
        toastStyle={{ color: "#fff", background: "#333" }} // Letras blancas, fondo oscuro
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate("/checkout")}>
          ← Regresar
        </button>

        <div className="form-card credit-form">
          <form className="form-left" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <label>Nombre</label>
            <input
              placeholder="Nombre"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                maxLength: 50,
                pattern: {
                  value: /^[\p{L}\s'-]+$/u,
                  message: "Solo letras y espacios",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/[^\p{L}\s'-]/gu, "").slice(0, 50);
                  value = value.replace(/\s+/g, " ").toLocaleUpperCase("es-ES");
                  handleChangeData({ target: { name: "nombre", value } });
                  setValue("nombre", value);
                },
              })}
              maxLength="50"
            />
            {errors.nombre && <span className="error">{errors.nombre.message}</span>}

            <label>Apellido</label>
            <input
              placeholder="Apellido"
              {...register("apellido", {
                required: "El apellido es obligatorio",
                maxLength: 50,
                pattern: {
                  value: /^[\p{L}\s'-]+$/u,
                  message: "Solo letras y espacios",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/[^\p{L}\s'-]/gu, "").slice(0, 50);
                  value = value.replace(/\s+/g, " ").toLocaleUpperCase("es-ES");
                  handleChangeData({ target: { name: "apellido", value } });
                  setValue("apellido", value);
                },
              })}
              maxLength="50"
            />
            {errors.apellido && <span className="error">{errors.apellido.message}</span>}

            <label>Email</label>
            <input
              placeholder="correo@ejemplo.com"
              type="email"
              {...register("email", {
                required: "El email es obligatorio",
                maxLength: 100,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
                onChange: (e) => {
                  handleChangeData({ target: { name: "email", value: e.target.value.slice(0, 100) } });
                },
              })}
              maxLength="100"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}

            <label>Ciudad</label>
            <input
              placeholder="Ciudad"
              {...register("ciudad", {
                required: "La ciudad es obligatoria",
                maxLength: 100,
                onChange: (e) => {
                  handleChangeData({ target: { name: "ciudad", value: e.target.value.slice(0, 100) } });
                },
              })}
              maxLength="100"
            />
            {errors.ciudad && <span className="error">{errors.ciudad.message}</span>}

            <label>Dirección</label>
            <input
              placeholder="Dirección"
              {...register("direccion", {
                required: "La dirección es obligatoria",
                maxLength: 100,
                onChange: (e) => {
                  handleChangeData({ target: { name: "direccion", value: e.target.value.slice(0, 100) } });
                },
              })}
              maxLength="100"
            />
            {errors.direccion && <span className="error">{errors.direccion.message}</span>}

            <label>Teléfono</label>
            <input
              placeholder="Telefono"
              type="tel"
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                maxLength: 15,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo números",
                },
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 15);
                  handleChangeData({ target: { name: "telefono", value } });
                  setValue("telefono", value);
                },
              })}
              maxLength="15"
            />
            {errors.telefono && <span className="error">{errors.telefono.message}</span>}

            <label>Número de Tarjeta</label>
            <input
              placeholder="1234 5678 9012 3456"
              {...register("numeroTarjeta", {
                required: "El número de tarjeta es obligatorio",
                maxLength: 19,
                pattern: {
                  value: /^[0-9\s]+$/,
                  message: "Solo números",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 16);
                  value = value.replace(/(.{4})/g, "$1 ").trim();
                  handleChangeTarjeta({ target: { name: "numeroTarjeta", value } });
                  setValue("numeroTarjeta", value);
                },
              })}
              maxLength="19"
            />
            {errors.numeroTarjeta && <span className="error">{errors.numeroTarjeta.message}</span>}

            <label>Fecha de Vencimiento</label>
            <input
              placeholder="MM/AA"
              {...register("expiry", {
                required: "La fecha es obligatoria",
                maxLength: 5,
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Formato MM/AA",
                },
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (value.length >= 3) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                  }
                  handleChangeTarjeta({ target: { name: "expiry", value } });
                  setValue("expiry", value);
                },
              })}
              maxLength="5"
            />
            {errors.expiry && <span className="error">{errors.expiry.message}</span>}

            <label>CVV</label>
            <input
              placeholder="•••"
              type="password"
              {...register("cvv", {
                required: "El CVV es obligatorio",
                maxLength: 4,
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "3 o 4 dígitos",
                },
                onFocus: () => setIsCvvFocused(true),
                onBlur: () => setIsCvvFocused(false),
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  handleChangeTarjeta({ target: { name: "cvv", value } });
                  setValue("cvv", value);
                },
              })}
              maxLength="4"
            />
            {errors.cvv && <span className="error">{errors.cvv.message}</span>}

            <label>Monto</label>
            <input
              placeholder="Monto"
              {...register("monto")}
              value={watch("monto") || ""}
              readOnly
              style={{ background: "#f5f5f5", color: "#888" }}
            />

            <button className="confirm-button" type="submit" disabled={loading}>
              {step === 1 ? "Generar Token" : step === 2 ? "Procesar Pago" : "Pago Completo"}
            </button>
          </form>

          <div className="form-right summary">
            <div className={`credit-card-wrapper ${isCvvFocused ? "flipped" : ""}`}>
              <div className="credit-card-preview front">
                <div className="chip" />
                <div className="card-number">
                  {watch("numeroTarjeta") || "1234 5678 9012 3456"}
                </div>
                <div className="card-footer">
                  <div className="card-name">
                    {cardName.trim() || "NOMBRE APELLIDO"}
                  </div>
                  <div className="card-expiry">
                    {watch("expiry") || "MM/AA"}
                  </div>
                </div>
              </div>
              <div className="credit-card-preview back">
                <div className="cvv-label">CVV</div>
                <div className="cvv-value">
                  {watch("cvv") || "•••"}
                </div>
              </div>
            </div>
            <p className="Tittle">
              <strong>Total a Pagar</strong>
              <br />
              ${watch("monto") || "0.00"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;