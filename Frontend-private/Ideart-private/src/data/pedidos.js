// Datos quemados para simular pedidos en el sistema
const pedidos = [
  {
    id: 1,
    numero: "A-001",
    nombre: "María González",
    email: "maria@example.com",
    fecha: "2025-07-12",
    estado: "Pendiente",
    ubicacion: "Santa Tecla",
    productos: [
      {
        nombre: "Taza personalizada",
        cantidad: 2,
        precio: 5.99,
        imagen: "https://via.placeholder.com/80",
      },
      {
        nombre: "Camiseta estampada",
        cantidad: 1,
        precio: 12.5,
        imagen: "https://via.placeholder.com/80",
      },
    ],
  },
  {
    id: 2,
    numero: "A-002",
    nombre: "Luis Pérez",
    email: "luis@example.com",
    fecha: "2025-07-11",
    estado: "Pendiente",
    ubicacion: "San Salvador",
    productos: [
      {
        nombre: "Libreta artística",
        cantidad: 3,
        precio: 3.5,
        imagen: "https://via.placeholder.com/80",
      },
    ],
  },
];

export default pedidos;
