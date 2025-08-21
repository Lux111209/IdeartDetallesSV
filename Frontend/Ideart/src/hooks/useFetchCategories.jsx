import { useState, useEffect, useCallback } from "react";

// Hook para obtener y construir las categorías de productos
const API_URL = "https://ideartdetallessv-1.onrender.com/api/products";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

// Función para obtener y construir las categorías
  const fetchAndBuild = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json(); 

      // Agrupar por productType y subType
      const map = {};

      data.data.forEach((p) => {
        if (!map[p.productType]) {
          map[p.productType] = {
            name: p.productType,
            // Usar la primera imagen o un placeholder
            // Si no hay imágenes, usar una imagen por defecto
            image: p.images?.[0] || "/placeholder.jpg",
            subcategories: new Set(),
          };
        }
        map[p.productType].subcategories.add(p.subType);
      });

        // Convertir el Set a Array y mapear a un nuevo array (array planos)
      // para que cada categoría tenga un array de subcategorías
      const parsed = Object.values(map).map((cat) => ({
        ...cat,
        subcategories: Array.from(cat.subcategories),
      }));

      setCategories(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndBuild();
  }, [fetchAndBuild]);

  return { categories, loading, error, refetch: fetchAndBuild };
};

export default useFetchCategories;
