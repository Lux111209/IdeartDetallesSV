import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import '../css/Checkout.css';

// Componente para mostrar notificaciones en línea
const icons = {
  error: <XCircle size={16} color="#d92d20" />,
  warning: <AlertTriangle size={16} color="#dc6803" />,
  info: <Info size={16} color="#1570ef" />,
  success: <CheckCircle size={16} color="#039855" />,
};

const Toast = ({ type = 'error', message }) => {
  return (
    <div className={`inline-toast ${type}`}>
      <div className="icon">{icons[type]}</div>
      <div className="message">{message}</div>
    </div>
  );
};

export default Toast;
