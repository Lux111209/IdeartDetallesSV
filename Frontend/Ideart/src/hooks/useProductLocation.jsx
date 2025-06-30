import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useProductLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

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
