import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import InlineToast from "../components/Toast";
import "../css/Checkout.css";

const CheckoutInfo = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const onlyLetters = (text) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(text);

  const handleConfirm = async () => {
    const newErrors = {
      name: name.trim() ? "" : "El nombre es obligatorio.",
      email: !email.trim()
        ? "El email es obligatorio."
        : !validateEmail(email.trim())
        ? "El email no es válido."
        : "",
      city: city.trim() ? "" : "La ciudad es obligatoria.",
      address: address.trim() ? "" : "La dirección es obligatoria.",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    try {
      setLoading(true);

      // Llamada al backend para crear el link de pago
      const res = await fetch("https://ideartdetallessv-1.onrender.com/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: name,
          paymentMethod,
          amountInCents: 50000, // ejemplo: $500.00 USD son 50000 (en centavos)
          currency: "USD",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al generar el link de pago");

      // Redirigir al link de pago de Wompi
      window.location.href = data.paymentLink;
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar el link de pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate("/shoppingcart")}>
          ← Regresar
        </button>

        <div className="form-card">
          <div className="form-left">
            <label>Nombre</label>
            <input
              placeholder="Ej: Alessandro Ramírez"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                if (onlyLetters(value)) setName(value);
              }}
            />
            {errors.name && <InlineToast type="warning" message={errors.name} />}

            <label>Email</label>
            <input
              placeholder="Ej: finnick_28@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <InlineToast type="warning" message={errors.email} />}

            <label>Ciudad</label>
            <input
              placeholder="Ej: San Salvador"
              value={city}
              onChange={(e) => {
                const value = e.target.value;
                if (onlyLetters(value)) setCity(value);
              }}
            />
            {errors.city && <InlineToast type="warning" message={errors.city} />}

            <label>Dirección</label>
            <input
              placeholder="Ej: Metropoli San Gabriel"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <InlineToast type="warning" message={errors.address} />}
          </div>

          <div className="form-right">
            <label>Método de Pago</label>
            <div className="payment-methods">
              <button
                className={paymentMethod === "credit" ? "active" : ""}
                onClick={() => setPaymentMethod("credit")}
              >
                Tarjeta de Crédito
              </button>
              <button
                className={paymentMethod === "paypal" ? "active" : ""}
                onClick={() => setPaymentMethod("paypal")}
              >
                PayPal
              </button>
            </div>

            <label>Nota</label>
            <input
              placeholder="Escribe tu nota"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Generando pago..." : "Confirmar Compra"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutInfo;
