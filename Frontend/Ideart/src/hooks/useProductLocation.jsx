import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Hook para manejar la ubicación del producto
export const useProductLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // Verifica si los datos del producto están disponibles en el estado de la ubicación
  useEffect(() => {
    const data = location.state;
    if (!data?.title || !data?.image || !data?.price) {
      alert("Datos del producto no encontrados.");
      navigate("/products");
    } else {
      setProduct(data);
    }
  }, [location.state, navigate]);

  return product;
};
