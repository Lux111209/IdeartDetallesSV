import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import usePaymentForm from "../hooks/usePayment.jsx";
import "../css/Checkout.css";

const CreditForm = () => {
  const navigate = useNavigate();

  const {
    formData,
    formDataTarjeta,
    errors,
    step,
    handleChangeData,
    handleChangeTarjeta,
    handleFirstStep,
    handleFinishPayment,
  } = usePaymentForm();

  const [isCvvFocused, setIsCvvFocused] = useState(false);

  // Formatea el número de tarjeta como XXXX XXXX XXXX XXXX
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => {
    handleChangeTarjeta({
      target: { name: "numeroTarjeta", value: formatCardNumber(e.target.value) },
    });
  };

  const handleCvvChange = (e) => {
    handleChangeTarjeta({
      target: { name: "cvv", value: e.target.value.replace(/\D/g, "").slice(0, 4) },
    });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    handleChangeTarjeta({ target: { name: "expiry", value } });
  };

  const handleNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\p{L}\s'-]/gu, ""); // letras, espacios, guion y apóstrofo
    value = value.replace(/\s+/g, " "); // colapsar espacios
    value = value.toLocaleUpperCase("es-ES");
    handleChangeData({ target: { name: "nombre", value } });
  };

  const handleApellidoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\p{L}\s'-]/gu, "");
    value = value.replace(/\s+/g, " ");
    value = value.toLocaleUpperCase("es-ES");
    handleChangeData({ target: { name: "apellido", value } });
  };

  const handleEmailChange = (e) => {
    handleChangeData({ target: { name: "email", value: e.target.value } });
  };

  const handleCiudadChange = (e) => {
    handleChangeData({ target: { name: "ciudad", value: e.target.value } });
  };

  const handleDireccionChange = (e) => {
    handleChangeData({ target: { name: "direccion", value: e.target.value } });
  };

  const handleTelefonoChange = (e) => {
    handleChangeData({ target: { name: "telefono", value: e.target.value.replace(/\D/g, "") } });
  };

  const handlePay = async () => {
    if (step === 1) await handleFirstStep();
    if (step === 2) await handleFinishPayment();
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
            {Object.entries(errors).map(
              ([field, msg]) => msg && <InlineToast key={field} type="warning" message={msg} />
            )}

            <label>Nombre</label>
            <input placeholder="Nombre" value={formData.nombre} onChange={handleNameChange} />

            <label>Apellido</label>
            <input placeholder="Apellido" value={formData.apellido} onChange={handleApellidoChange} />

            <label>Email</label>
            <input placeholder="correo@ejemplo.com" value={formData.email} onChange={handleEmailChange} />

            <label>Ciudad</label>
            <input placeholder="Ciudad" value={formData.ciudad} onChange={handleCiudadChange} />

            <label>Dirección</label>
            <input placeholder="Dirección" value={formData.direccion} onChange={handleDireccionChange} />

            <label>Teléfono</label>
            <input placeholder="Telefono" value={formData.telefono} onChange={handleTelefonoChange} />

            <label>Número de Tarjeta</label>
            <input
              placeholder="1234 5678 9012 3456"
              value={formDataTarjeta.numeroTarjeta}
              onChange={handleCardNumberChange}
            />

            <label>Fecha de Vencimiento</label>
            <input placeholder="MM/AA" value={formDataTarjeta.expiry} onChange={handleExpiryChange} />

            <label>CVV</label>
            <input
              placeholder="•••"
              value={formDataTarjeta.cvv}
              onFocus={() => setIsCvvFocused(true)}
              onBlur={() => setIsCvvFocused(false)}
              onChange={handleCvvChange}
            />

            <button className="confirm-button" onClick={handlePay}>
              {step === 1 ? "Generar Token" : step === 2 ? "Procesar Pago" : "Pago Completo"}
            </button>
          </div>

          <div className="form-right summary">
            <div className={`credit-card-wrapper ${isCvvFocused ? "flipped" : ""}`}>
              <div className="credit-card-preview front">
                <div className="chip" />
                <div className="card-number">{formDataTarjeta.numeroTarjeta || "1234 5678 9012 3456"}</div>
                <div className="card-footer">
                  <div className="card-name">{formData.nombre || "NOMBRE APELLIDO"}</div>
                  <div className="card-expiry">{formDataTarjeta.expiry || "MM/AA"}</div>
                </div>
              </div>
              <div className="credit-card-preview back">
                <div className="cvv-label">CVV</div>
                <div className="cvv-value">{formDataTarjeta.cvv || "•••"}</div>
              </div>
            </div>
            <p className="Tittle">
              <strong>Total a Pagar</strong>
              <br />
              ${formData.monto.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;
