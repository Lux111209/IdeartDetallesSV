import React, { useState } from "react";
import useContactForm from "../hooks/useFetchContactForm";
import InlineToast from "../components/Toast";

const ContactForm = () => {
  const [values, setValues] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); 

  const { loading, sendMessage } = useContactForm();

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    try {
      await sendMessage(values);
      setStatus("success");
      setValues({ email: "", phone: "", name: "", message: "" });
      setErrors({});
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>

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
