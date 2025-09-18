import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import "../css/Checkout.css";

const CreditForm = () => {
  const navigate = useNavigate();

  // Estados para los datos de la tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Formatea el número de tarjeta como XXXX XXXX XXXX XXXX
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => setCardNumber(formatCardNumber(e.target.value));
  const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };
  const handleNameChange = (e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase());

  // Validaciones
  const validateCardNumber = (num) => /^\d{4} \d{4} \d{4} \d{4}$/.test(num);
  const validateCVV = (code) => /^\d{3,4}$/.test(code);
  const validateExpiry = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);

  // Convertir MM/AA a MM/YYYY para Wompi
  const parseExpiry = (date) => {
    const [mm, yy] = date.split("/");
    return { month: mm, year: "20" + yy };
  };

  const handlePay = async () => {
    setMessage("");
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber) ? "" : "Número inválido (16 dígitos)",
      cvv: validateCVV(cvv) ? "" : "CVV inválido (3-4 dígitos)",
      expiry: validateExpiry(expiry) ? "" : "Fecha inválida (MM/AA)",
      name: name.trim() ? "" : "Nombre requerido",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    setLoading(true);
    try {
      // 1️⃣ Pedir token al backend
      const tokenRes = await axios.post("http://localhost:3001/api/token");
      const token = tokenRes.data.access_token;

      // 2️⃣ Preparar datos tokenizados
      const { month, year } = parseExpiry(expiry);
      const paymentData = {
        tarjetaCreditoDebido: {
          numeroTarjeta: cardNumber.replace(/\s/g, ""),
          cvv,
          mesVencimiento: month,
          anioVencimiento: year,
        },
        nombre,
        monto: 112.67 // fijo por ejemplo, puedes hacerlo dinámico
      };

      // 3️⃣ Llamar al backend para procesar pago
      const paymentRes = await axios.post("http://localhost:3001/api/testPayment", {
        token,
        formData: paymentData,
      });

      if (paymentRes.data.estado === "APPROVED") {
        setShowSuccess(true);
        setMessage("✅ Pago aprobado con éxito!");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMessage(`❌ Pago fallido: ${paymentRes.data.mensaje || "Error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error procesando el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate("/checkout")}>← Regresar</button>
        <div className="form-card credit-form">
          <div className="form-left">
            {showSuccess && <InlineToast type="success" message={message} />}
            {message && !showSuccess && <InlineToast type="warning" message={message} />}

            <label>Nombre en la Tarjeta</label>
            <input placeholder="Nombre Apellido" value={name} onChange={handleNameChange} />
            {errors.name && <InlineToast type="warning" message={errors.name} />}

            <label>Número de Tarjeta</label>
            <input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={handleCardNumberChange} />
            {errors.cardNumber && <InlineToast type="warning" message={errors.cardNumber} />}

            <label>Fecha de Vencimiento</label>
            <input placeholder="MM/AA" value={expiry} onChange={handleExpiryChange} />
            {errors.expiry && <InlineToast type="warning" message={errors.expiry} />}

            <label>CVV</label>
            <input placeholder="•••" value={cvv} onFocus={() => setIsCvvFocused(true)} onBlur={() => setIsCvvFocused(false)} onChange={handleCvvChange} />
            {errors.cvv && <InlineToast type="warning" message={errors.cvv} />}

            <button className="confirm-button" onClick={handlePay} disabled={loading}>
              {loading ? "Procesando..." : "Pagar Ahora"}
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
            <p className="Tittle"><strong>Total a Pagar</strong><br />$112.67</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;
