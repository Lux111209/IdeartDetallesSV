import { useState } from "react";

// Validaciones
const validateCardNumber = (num) => /^\d{16}$/.test(num.replace(/\s/g, ""));
const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);
const validateExpiry = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);

const parseExpiry = (date) => {
  const [mm, yy] = date.split("/");
  return { month: Number(mm), year: Number("20" + yy) };
};

const usePaymentForm = () => {
  const [datosEnviados, setDatosEnviados] = useState(null);
  const [step, setStep] = useState(1);
  const [accessToken, setAccessToken] = useState(null);

  const [formDataTarjeta, setFormDataTarjeta] = useState({
    numeroTarjeta: "",
    cvv: "",
    mesVencimiento: 0,
    anioVencimiento: 0,
    expiry: "", // MM/AA
  });

  const [formData, setFormData] = useState({
    monto: 112.67,
    urlRedirect: "https://www.ricaldone.edu.sv",
    nombre: "JUAN",
    apellido: "PEREZ",
    email: "correo@test.com",
    ciudad: "SAN SALVADOR",
    direccion: "AVENIDA PRUEBA 123",
    idPais: "SV",
    idRegion: "SV-SS",
    codigoPostal: "1101",
    telefono: "77771234",
  });

  const [errors, setErrors] = useState({});

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target;
    setFormDataTarjeta((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      monto: 112.67,
      urlRedirect: "https://www.ricaldone.edu.sv",
      nombre: "JUAN",
      apellido: "PEREZ",
      email: "correo@test.com",
      ciudad: "SAN SALVADOR",
      direccion: "AVENIDA PRUEBA 123",
      idPais: "SV",
      idRegion: "SV-SS",
      codigoPostal: "1101",
      telefono: "77771234",
    });
    setDatosEnviados(null);
    setStep(1);
    setAccessToken(null);
    setFormDataTarjeta({
      numeroTarjeta: "",
      cvv: "",
      mesVencimiento: 0,
      anioVencimiento: 0,
      expiry: "",
    });
    setErrors({});
  };

  const validarTarjeta = () => {
    const newErrors = {
      numeroTarjeta: validateCardNumber(formDataTarjeta.numeroTarjeta)
        ? ""
        : "Número inválido (16 dígitos)",
      cvv: validateCVV(formDataTarjeta.cvv) ? "" : "CVV inválido (3-4 dígitos)",
      expiry: validateExpiry(formDataTarjeta.expiry) ? "" : "Fecha inválida (MM/AA)",
      nombre: formData.nombre.trim() ? "" : "Nombre requerido",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleFirstStep = async () => {
    if (!validarTarjeta()) return;

    try {
      const res = await fetch("http://localhost:5000/api/payment/token", { method: "POST" });
      if (!res.ok) throw new Error(`Error al obtener token: ${res.status}`);
      const tokenData = await res.json();
      setAccessToken(tokenData.access_token);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert(`Error obteniendo token: ${error.message}`);
    }
  };

  const handleFinishPayment = async () => {
    try {
      const { month, year } = parseExpiry(formDataTarjeta.expiry);

      const paymentData = {
        ...formData,
        tarjetaCreditoDebido: {
          numeroTarjeta: formDataTarjeta.numeroTarjeta.replace(/\s/g, ""),
          cvv: formDataTarjeta.cvv,
          mesVencimiento: month,
          anioVencimiento: year,
        },
      };

      console.log("PAYLOAD ENVIADO:", { token: accessToken, formData: paymentData });

      const res = await fetch("http://localhost:5000/api/payment/payment3ds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken, formData: paymentData }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al procesar pago: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (data.estado === "APPROVED") alert("✅ Pago aprobado en sandbox");
      else alert(`❌ Pago fallido: ${data.mensaje || "Error"}`);
    } catch (error) {
      console.error(error);
      alert(`Error en el proceso de pago: ${error.message}`);
    } finally {
      setStep(3);
      limpiarFormulario();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDatosEnviados(formData);
  };

  return {
    formData,
    datosEnviados,
    formDataTarjeta,
    step,
    errors,
    setStep,
    handleChangeData,
    handleChangeTarjeta,
    handleSubmit,
    limpiarFormulario,
    handleFirstStep,
    handleFinishPayment,
  };
};

export default usePaymentForm;
