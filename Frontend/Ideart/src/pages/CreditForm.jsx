import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import "../css/Checkout.css";

const CreditForm = () => {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setExpiry(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    setName(value);
  };

  const validateCardNumber = (num) => /^\d{4} \d{4} \d{4} \d{4}$/.test(num);
  const validateCVV = (code) => /^\d{3,4}$/.test(code);
  const validateExpiry = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const validatePassword = (pwd) => pwd.length >= 8;

  const handlePay = () => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber) ? "" : "Número inválido (16 dígitos)",
      cvv: validateCVV(cvv) ? "" : "CVV inválido (3-4 dígitos)",
      expiry: validateExpiry(expiry) ? "" : "Fecha inválida (MM/AA)",
      name: name.trim() ? "" : "Nombre requerido",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    alert("¡Tu compra fue exitosa!");
    navigate("/");
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
            <label>Nombre en la Tarjeta</label>
            <input
              placeholder="Nombre Apellido"
              value={name}
              onChange={handleNameChange}
            />
            {errors.name && <InlineToast type="warning" message={errors.name} />}

            <label>Número de Tarjeta</label>
            <input
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
            {errors.cardNumber && <InlineToast type="warning" message={errors.cardNumber} />}

            <label>Fecha de Vencimiento</label>
            <input
              placeholder="MM/AA"
              value={expiry}
              onChange={handleExpiryChange}
            />
            {errors.expiry && <InlineToast type="warning" message={errors.expiry} />}

            <label>CVV</label>
            <input
              placeholder="•••"
              value={cvv}
              onFocus={() => setIsCvvFocused(true)}
              onBlur={() => setIsCvvFocused(false)}
              onChange={handleCvvChange}
            />
            {errors.cvv && <InlineToast type="warning" message={errors.cvv} />}

            <button className="confirm-button" onClick={handlePay}>
              Pagar Ahora
            </button>
          </div>

          <div className="form-right summary">
            <div className={`credit-card-wrapper ${isCvvFocused ? "flipped" : ""}`}>
              <div className="credit-card-preview front">
                <div className="chip" />
                <div className="card-number">{cardNumber || "1234 5678 9012 3456"}</div>
                <div className="card-footer">
                  <div className="card-name">{name || "NOMBRE APELLIDO"}</div>
                  <div className="card-expiry">{expiry || "MM/AA"}</div>
                </div>
              </div>
              <div className="credit-card-preview back">
                <div className="cvv-label">CVV</div>
                <div className="cvv-value">{cvv || "•••"}</div>
              </div>
            </div>
            <p className="Tittle">
              <strong>Total a Pagar</strong>
              <br />$112.67
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;
