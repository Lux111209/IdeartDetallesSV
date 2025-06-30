import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import "../css/Checkout.css";

const CheckoutInfo = () => {
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const navigate = useNavigate();

    const handleConfirm = () => {
        if (paymentMethod === "credit") {
            navigate("/creditform");
        }
    };

    return (
        <>
            <TopBar />
            <Navbar />
            <div className="checkout-container">
                <button className="back-button" onClick={() => navigate("/shoppingcart")}>← Regresar</button>
                <div className="form-card">
                    <div className="form-left">
                        <label>Nombre</label>
                        <input placeholder="Ej: Alessandro Ramírez" />
                        <label>Email</label>
                        <input placeholder="Ej: finnick_28@gmail.com" />
                        <label>Ciudad</label>
                        <input placeholder="Ej: San Salvador" />
                        <label>Dirección</label>
                        <input placeholder="Ej: Metropoli San Gabriel" />
                    </div>
                    <div className="form-right">
                        <label>Método de Pago</label>
                        <div className="payment-methods">
                            <button className={paymentMethod === "credit" ? "active" : ""} onClick={() => setPaymentMethod("credit")}>
                                Tarjeta de Crédito
                            </button>
                            <button className={paymentMethod === "paypal" ? "active" : ""} onClick={() => setPaymentMethod("paypal")}>
                                PayPal
                            </button>
                        </div>
                        <label>Nota</label>
                        <input placeholder="Escribe tu nota" />
                        <button className="confirm-button" onClick={handleConfirm}>
                            Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutInfo;
