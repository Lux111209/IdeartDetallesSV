import { useState } from "react";

const initialFormData = {
  nombre: "",
  apellido: "",
  email: "",
  ciudad: "",
  direccion: "",
  telefono: "",
  monto: 0,
};

const initialFormDataTarjeta = {
  numeroTarjeta: "",
  expiry: "",
  cvv: "",
};

const usePaymentForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formDataTarjeta, setFormDataTarjeta] = useState(initialFormDataTarjeta);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target;
    setFormDataTarjeta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Puedes agregar validaciones y lógica de pasos aquí
  const handleFirstStep = async () => {
    setStep(2);
  };

  const handleFinishPayment = async (callback) => {
  setStep(3);
  if (typeof callback === "function") {
    await callback();
  }
};

  return {
    formData,
    formDataTarjeta,
    errors,
    step,
    handleChangeData,
    handleChangeTarjeta,
    handleFirstStep,
    handleFinishPayment,
  };
};

export default usePaymentForm;