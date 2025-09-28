import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import usePaymentUnified from "../hooks/usePayment.jsx";
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

  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  // Handlers con validaciones de límites
  const handleNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\p{L}\s'-]/gu, "").slice(0, 50);
    value = value.replace(/\s+/g, " ");
    value = value.toLocaleUpperCase("es-ES");
    handleChangeData({ target: { name: "nombre", value } });
  };

  const handleApellidoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\p{L}\s'-]/gu, "").slice(0, 50);
    value = value.replace(/\s+/g, " ");
    value = value.toLocaleUpperCase("es-ES");
    handleChangeData({ target: { name: "apellido", value } });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.slice(0, 100);
    handleChangeData({ target: { name: "email", value } });
  };

  const handleCiudadChange = (e) => {
    const value = e.target.value.slice(0, 100);
    handleChangeData({ target: { name: "ciudad", value } });
  };

  const handleDireccionChange = (e) => {
    const value = e.target.value.slice(0, 100);
    handleChangeData({ target: { name: "direccion", value } });
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);
    handleChangeData({ target: { name: "telefono", value } });
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    handleChangeTarjeta({ target: { name: "numeroTarjeta", value } });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    handleChangeTarjeta({ target: { name: "expiry", value } });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    handleChangeTarjeta({ target: { name: "cvv", value } });
  };

  const handleMontoChange = (e) => {
    let value = e.target.value.replace(/[^\d.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    if (parts[0] && parts[0].length > 10) {
      parts[0] = parts[0].slice(0, 10);
      value = parts.join(".");
    }
    const numericValue = value === "" ? 0 : parseFloat(value) || 0;
    handleChangeData({ target: { name: "monto", value: numericValue } });
  };

  // Animación: nombre y apellido juntos
  const cardName =
    (formData?.nombre ? formData.nombre : "") +
    (formData?.apellido ? " " + formData.apellido : "");

  // Botón de pasos con debugging detallado
  const handleButtonClick = async () => {
    console.log("=== DEBUGGING PAYMENT FLOW ===");
    console.log("Current step:", step);
    console.log("AccessToken:", accessToken);
    console.log("FormData:", JSON.stringify(formData, null, 2));
    console.log("FormDataTarjeta:", JSON.stringify(formDataTarjeta, null, 2));
    try {
      if (step === 1) {
        await handleFirstStep();
      } else if (step === 2) {
        await handleFinishPayment();
      }
    } catch (err) {
      setError(err.message);
      console.error("Error en el flujo de pago:", err);
    }
    console.log("=== END DEBUGGING ===");
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate("/checkout")}>
          ← Regresar
        </button>

        <div className="form-card credit-form">
          <div className="form-left">
            {error && (
              <InlineToast
                type="error"
                message={`Error al procesar el pago: ${error}`}
              />
            )}

            <label>Nombre</label>
            <input
              placeholder="Nombre"
              value={formData?.nombre || ""}
              onChange={handleNameChange}
              name="nombre"
              maxLength="50"
            />

            <label>Apellido</label>
            <input
              placeholder="Apellido"
              value={formData?.apellido || ""}
              onChange={handleApellidoChange}
              name="apellido"
              maxLength="50"
            />

            <label>Email</label>
            <input
              placeholder="correo@ejemplo.com"
              value={formData?.email || ""}
              onChange={handleEmailChange}
              name="email"
              type="email"
              maxLength="100"
            />

            <label>Ciudad</label>
            <input
              placeholder="Ciudad"
              value={formData?.ciudad || ""}
              onChange={handleCiudadChange}
              name="ciudad"
              maxLength="100"
            />

            <label>Dirección</label>
            <input
              placeholder="Dirección"
              value={formData?.direccion || ""}
              onChange={handleDireccionChange}
              name="direccion"
              maxLength="100"
            />

            <label>Teléfono</label>
            <input
              placeholder="Telefono"
              value={formData?.telefono || ""}
              onChange={handleTelefonoChange}
              name="telefono"
              type="tel"
              maxLength="15"
            />

            <label>Número de Tarjeta</label>
            <input
              placeholder="1234 5678 9012 3456"
              value={formDataTarjeta?.numeroTarjeta || ""}
              onChange={handleCardNumberChange}
              name="numeroTarjeta"
              maxLength="19"
            />

            <label>Fecha de Vencimiento</label>
            <input
              placeholder="MM/AA"
              value={formDataTarjeta?.expiry || ""}
              onChange={handleExpiryChange}
              name="expiry"
              maxLength="5"
            />

            <label>CVV</label>
            <input
              placeholder="•••"
              value={formDataTarjeta?.cvv || ""}
              onFocus={() => setIsCvvFocused(true)}
              onBlur={() => setIsCvvFocused(false)}
              onChange={handleCvvChange}
              name="cvv"
              type="password"
              maxLength="4"
            />

            <label>Monto</label>
            <input
              placeholder="Monto"
              value={formData?.monto || ""}
              onChange={handleMontoChange}
              name="monto"
              type="number"
              min="0"
              step="0.01"
            />

            <button className="confirm-button" onClick={handleButtonClick} disabled={loading}>
              {step === 1 ? "Generar Token" : step === 2 ? "Procesar Pago" : "Pago Completo"}
            </button>
          </div>

          <div className="form-right summary">
            <div className={`credit-card-wrapper ${isCvvFocused ? "flipped" : ""}`}>
              <div className="credit-card-preview front">
                <div className="chip" />
                <div className="card-number">
                  {formDataTarjeta?.numeroTarjeta || "1234 5678 9012 3456"}
                </div>
                <div className="card-footer">
                  <div className="card-name">
                    {cardName.trim() || "NOMBRE APELLIDO"}
                  </div>
                  <div className="card-expiry">
                    {formDataTarjeta?.expiry || "MM/AA"}
                  </div>
                </div>
              </div>
              <div className="credit-card-preview back">
                <div className="cvv-label">CVV</div>
                <div className="cvv-value">
                  {formDataTarjeta?.cvv || "•••"}
                </div>
              </div>
            </div>
            <p className="Tittle">
              <strong>Total a Pagar</strong>
              <br />
              ${typeof formData?.monto === "number" ? formData.monto.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;