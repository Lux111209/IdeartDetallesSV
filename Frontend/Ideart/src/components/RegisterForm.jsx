import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import '../css/Register.css'; // Asegúrate que la ruta a tu CSS es correcta
import fondo from '../assets/Register.png'; // Se importa tu imagen de fondo

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    // Se restaura el div para usar tu imagen de fondo
    <div className="registro-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="form-wrapper">
        <h2 className="form-title">Registrarse</h2>
        <form className="form-fields" onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <div className="date-input-wrapper">
            <input
              name="fechaNacimiento"
              type="text" 
              placeholder="Fecha de Nacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = 'text';
                }
              }}
              required
            />
            <Calendar className="calendar-icon" />
          </div>

          <button type="submit">Iniciar</button>
        </form>
      </div>
    </div>
  );
}