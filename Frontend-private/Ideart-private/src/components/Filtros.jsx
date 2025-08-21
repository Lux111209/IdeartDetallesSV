import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FilterPanel = () => {
  const [selectedColor, setSelectedColor] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      minPrice: 0,
      maxPrice: 5000,
      size: "",
      discount: "",
    },
  });

  const onSubmit = (data) => {
    if (data.minPrice > data.maxPrice) {
      toast.error("El precio mínimo no puede ser mayor que el máximo");
      return;
    }

    const filtros = {
      ...data,
      color: selectedColor,
    };

    console.log("Filtros aplicados:", filtros);
    toast.success("Filtros aplicados correctamente ✅");
  };

  const handleReset = () => {
    reset();
    setSelectedColor(null);
    toast.info("Filtros reiniciados");
  };

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700", "#8A2BE2"];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 bg-white rounded-2xl shadow-md space-y-4"
    >
      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium">Categoría</label>
        <select
          {...register("category")}
          className="w-full border rounded-md p-2"
        >
          <option value="">Todas</option>
          <option value="ropa">Ropa</option>
          <option value="zapatos">Zapatos</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium">Precio</label>
        <div className="flex gap-2">
          <input
            type="number"
            {...register("minPrice", { min: 0 })}
            placeholder="Mínimo"
            className="w-1/2 border rounded-md p-2"
          />
          <input
            type="number"
            {...register("maxPrice", { min: 0 })}
            placeholder="Máximo"
            className="w-1/2 border rounded-md p-2"
          />
        </div>
        {errors.minPrice && (
          <span className="text-red-500 text-sm">
            El mínimo debe ser mayor o igual a 0
          </span>
        )}
        {errors.maxPrice && (
          <span className="text-red-500 text-sm">
            El máximo debe ser mayor o igual a 0
          </span>
        )}

        {/* Range slider */}
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={watch("maxPrice")}
          onChange={(e) =>
            reset({ ...watch(), maxPrice: parseInt(e.target.value) })
          }
          className="w-full mt-2"
        />
        <p className="text-xs text-gray-500">
          Rango actual: ${watch("minPrice")} - ${watch("maxPrice")}
        </p>
      </div>

      {/* Colores */}
      <div>
        <label className="block text-sm font-medium">Color</label>
        <div className="flex gap-2 mt-1">
          {colors.map((color, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tallas */}
      <div>
        <label className="block text-sm font-medium">Talla</label>
        <select
          {...register("size")}
          className="w-full border rounded-md p-2"
        >
          <option value="">Todas</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      {/* Descuento */}
      <div>
        <label className="block text-sm font-medium">Descuento</label>
        <select
          {...register("discount")}
          className="w-full border rounded-md p-2"
        >
          <option value="">Cualquiera</option>
          <option value="10">10% o más</option>
          <option value="20">20% o más</option>
          <option value="30">30% o más</option>
          <option value="50">50% o más</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  );
};

export default FilterPanel;
