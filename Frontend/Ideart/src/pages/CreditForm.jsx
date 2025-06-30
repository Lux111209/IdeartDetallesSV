import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import "../css/Checkout.css";

const CreditForm = () => {
  const navigate = useNavigate();

  const handlePay = () => {
    alert("¡Tu compra fue exitosa!");
    navigate("/");
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate("/checkout")}>← Regresar</button>
        <div className="form-card credit-form">
          <div className="form-left">
            <label>Número de Tarjeta</label>
            <input placeholder="Ingresa los 16 dígitos de tu tarjeta" />
            <label>CVV</label>
            <input placeholder="Ingresa los 3 o 4 números de la tarjeta" />
            <label>Fecha de Vencimiento</label>
            <input placeholder="Ingresa la fecha de vencimiento de la tarjeta" />
            <label>Contraseña</label>
            <input placeholder="Ingresa tu contraseña dinámica" />
            <button className="confirm-button" onClick={handlePay}>
              Pagar Ahora
            </button>
          </div>
          <div className="form-right summary">
            <img src="/assets/Images/credit-card.png" alt="credit" />
            <p><strong>Total a Pagar</strong><br />$112.67</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditForm;
