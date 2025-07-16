const pedidos = [
  {
    id: 1,
    nombre: "Jason Alberto",
    numero: 1,
    email: "jasonalberto@gmail.com",
    cantidad: 35,
    descripcion: "Desea tazas personalizadas con diseño anime. Entregar antes del viernes.",
    producto: {
      nombre: "Taza con diseño de Sylveon",
      precio: 9.80,
      imagen: "/taza.png", // esta imagen debe estar en tu carpeta public
      talla: "Adulto",
      color: "Azul",
      stock: "En Stock"
    }
  },
  {
    id: 2,
    nombre: "Valeria Sánchez",
    numero: 2,
    email: "valeria.sanchez@example.com",
    cantidad: 12,
    descripcion: "Playeras rosas para grupo juvenil.",
    producto: {
      nombre: "Playera personalizada",
      precio: 12.50,
      imagen: "/playera.png",
      talla: "M",
      color: "Rosa pastel",
      stock: "En Stock"
    }
  },
  {
    id: 3,
    nombre: "Carlos Méndez",
    numero: 3,
    email: "carlosmendez@email.com",
    cantidad: 8,
    descripcion: "Diseño corporativo para tazas de empresa.",
    producto: {
      nombre: "Taza corporativa con logo",
      precio: 11.00,
      imagen: "/taza-empresa.png",
      talla: "Única",
      color: "Blanco",
      stock: "Bajo stock"
    }
  }
];

export default pedidos;
