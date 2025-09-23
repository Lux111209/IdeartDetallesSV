import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import usePaymentForm from "../hooks/usePaymentForm";
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
    handleChangeData({ target: { name: "nombre", value: e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase() } });
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
            {Object.values(errors).map((msg, idx) => msg && <InlineToast key={idx} type="warning" message={msg} />)}

            <label>Nombre en la Tarjeta</label>
            <input placeholder="Nombre Apellido" value={formData.nombre} onChange={handleNameChange} />

            <label>Número de Tarjeta</label>
            <input placeholder="1234 5678 9012 3456" value={formDataTarjeta.numeroTarjeta} onChange={handleCardNumberChange} />

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
            <p className="Tittle"><strong>Total a Pagar</strong><br />${formData.monto.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;
