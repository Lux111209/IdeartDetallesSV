import { useState } from "react";

const usePaymentUnified = () => {
  const [datosEnviados, setDatosEnviados] = useState(null);
  const [step, setStep] = useState(1);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formDataTarjeta, setFormDataTarjeta] = useState({
    numeroTarjeta: "",
    cvv: "",
    expiry: "", // ahora se guarda MM/AA en un solo campo
  });

  const [formData, setFormData] = useState({
    monto: 0.01,
    urlRedirect: "https://www.ricaldone.edu.sv",
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    direccion: "",
    idPais: "SV",
    idRegion: "SV-SS",
    codigoPostal: "1101",
    telefono: "",
  });

  // Cambios en datos personales
  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cambios en datos de tarjeta
  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target;
    setFormDataTarjeta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      monto: 0.01,
      urlRedirect: "https://www.ricaldone.edu.sv",
      nombre: "",
      apellido: "",
      email: "",
      ciudad: "",
      direccion: "",
      idPais: "SV",
      idRegion: "SV-SS",
      codigoPostal: "1101",
      telefono: "",
    });
    setDatosEnviados(null);
    setStep(1);
    setAccessToken(null);
    setFormDataTarjeta({
      numeroTarjeta: "",
      cvv: "",
      expiry: "",
    });
  };

  // Paso 1: Obtener token
  const handleFirstStep = async () => {
    setLoading(true);
    try {
      const tokenResponse = await fetch("https://ideartdetallessv-1.onrender.com/payment/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Error al obtener token: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);
      setStep(2);
      return { success: true };
    } catch (error) {
      // NO alert aquí
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Enviar pago
  const handleFinishPayment = async () => {
    setLoading(true);
    try {
      let { expiry, numeroTarjeta, cvv } = formDataTarjeta;
      const [mesRaw, anioRaw] = expiry.split("/");
      let mesVencimiento = mesRaw?.padStart(2, "0");
      let anioVencimiento = anioRaw?.length === 2 ? `20${anioRaw}` : anioRaw;

      if (!mesVencimiento || parseInt(mesVencimiento) < 1 || parseInt(mesVencimiento) > 12) {
        throw new Error("El mes de vencimiento debe estar entre 01 y 12");
      }
      if (!anioVencimiento || anioVencimiento.length !== 4) {
        throw new Error("El año de vencimiento debe tener 4 dígitos (ejemplo: 2025)");
      }

      const formDataPayment = {
        ...formData,
        tarjetaCreditoDebido: {
          numeroTarjeta,
          cvv,
          mesVencimiento,
          anioVencimiento,
        },
      };

      const paymentResponse = await fetch(
        "https://ideartdetallessv-1.onrender.com/payment/payment3ds",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken, formData: formDataPayment }),
        }
      );

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        throw new Error(`Error al procesar pago: ${errorText}`);
      }

      const paymentData = await paymentResponse.json();
      limpiarFormulario();
      setStep(3); // <-- Cambia el paso después de limpiar
      return { success: true, data: paymentData };
    } catch (error) {
      // NO alert aquí
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    datosEnviados,
    handleChangeData,
    handleChangeTarjeta,
    formDataTarjeta,
    limpiarFormulario,
    handleFirstStep,
    handleFinishPayment,
    step,
    setStep,
    accessToken,
    loading,
  };
};

export default usePaymentUnified;
