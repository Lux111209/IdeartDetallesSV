import React, { useState } from "react";
import useContactForm from "../hooks/useFetchContactForm"; // Hook para enviar el mensaje
import InlineToast from "../components/Toast"; // Componente de alerta

const ContactForm = () => {
  // Estado para guardar los valores del formulario
  const [values, setValues] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el resultado del envío (success o error)
  const [status, setStatus] = useState(null); 

  // Extrae loading y la función de envío desde el hook
  const { loading, sendMessage } = useContactForm();

  // Maneja los cambios en los inputs
  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  // Valida los datos ingresados
  const validate = () => {
    const newErrors = {};

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
      newErrors.email = "Correo inválido";
    }

    if (values.phone && !/^\d{8,15}$/.test(values.phone)) {
      newErrors.phone = "Teléfono inválido (mínimo 8 dígitos)";
    }

    if (!values.name.trim()) {
      newErrors.name = "Nombre es requerido";
    }

    if (!values.message.trim() || values.message.length < 10) {
      newErrors.message = "Mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envía el formulario si pasa la validación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    try {
      await sendMessage(values); // Envío exitoso
      setStatus("success");
      setValues({ email: "", phone: "", name: "", message: "" });
      setErrors({});
    } catch (error) {
      setStatus("error"); // Falló el envío
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Email y teléfono */}
      <div className="form-row">
        <div style={{ width: "100%" }}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <InlineToast type="warning" message={errors.email} />}
        </div>

        <div style={{ width: "100%" }}>
          <input
            type="tel"
            name="phone"
            placeholder="Número telefónico"
            value={values.phone}
            onChange={handleChange}
          />
          {errors.phone && <InlineToast type="warning" message={errors.phone} />}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <InlineToast type="warning" message={errors.name} />}
      </div>

      {/* Mensaje */}
      <div>
        <textarea
          rows="5"
          name="message"
          placeholder="Mensaje"
          value={values.message}
          onChange={handleChange}
        />
        {errors.message && <InlineToast type="warning" message={errors.message} />}
      </div>

      {/* Botón de envío */}
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>

      {/* Mensajes de estado */}
      {status === "success" && (
        <InlineToast type="success" message="¡Mensaje enviado con éxito!" />
      )}
      {status === "error" && (
        <InlineToast type="error" message="Hubo un error al enviar el mensaje. Intenta nuevamente." />
      )}
    </form>
  );
};

export default ContactForm;
