# 🎨 IdeartSv

**¡Configuraciones iniciales:**
+ Npm install del lado del Server  
+ Npm install del lado de Frontend  
+ Crear archivo .env con las variables de entorno necesarias
+ node index.js para correr backend  
+ npm run dev para levantar el frontend  
+ Verificar las rutas y puertos  

**¡Capturamos tus recuerdos en cada diseño!**

**IdeartSv** es una plataforma web y móvil dedicada a ofrecer artículos personalizados mediante la técnica de sublimación, pensada para quienes desean transformar momentos especiales en recuerdos únicos. Ya sea un evento familiar, empresarial o una fecha significativa, IdeartSv proporciona productos creativos, de alta calidad y completamente personalizados para cada ocasión.

Nuestra propuesta busca conectar emocionalmente con cada cliente, garantizando una experiencia memorable desde la elección del diseño hasta la entrega final del producto.

---

## 🧭 Misión y Visión

🎯 **Misión**  
Crear experiencias memorables y significativas para cada uno de nuestros clientes, ofreciendo artículos personalizados mediante la técnica de sublimación que sean para toda ocasión y evento, que capturen la esencia de sus momentos especiales y que los conviertan en recuerdos únicos y atesorados.

👁️ **Visión**  
Ser un negocio que esté a la vanguardia de la industria de artículos personalizados, adoptando continuamente nuevas tecnologías y tendencias en sublimación y estampados para ofrecer soluciones creativas y adaptadas a las necesidades cambiantes de nuestros clientes en cada celebración y evento, manteniendo siempre la excelencia en calidad y diseño.

---



## ✍️ Uso de Nomenclaturas para Nombramiento

En este proyecto se utiliza la convención **PascalCase** para el nombramiento de archivos, funciones y variables, con el objetivo de mantener un estilo consistente, legible y profesional en todo el código fuente.

Se especifica en este documento que la nomenclatura oficial adoptada para la aplicación es **PascalCase**, por lo tanto, debe ser utilizada en todo el proyecto para nombrar componentes, archivos, funciones y variables.



## 🚀 Tecnologías Utilizadas:
Este proyecto fue desarrollado utilizando el **Stack MERN** con **Vite** como herramienta de desarrollo, incluyendo las siguientes tecnologías y dependencias:

### Backend (Node.js + Express + MongoDB)
- 🌐 **MongoDB** (con Mongoose) – Base de datos NoSQL para almacenar información de usuarios, productos, servicios y órdenes.
- ⚙️ **Express.js** – Framework de backend para manejar rutas y lógica del servidor.
- 🟢 **Node.js** – Entorno de ejecución para el servidor backend.

### Dependencias del Backend:
- **bcryptjs** (^3.0.2) – Encriptación de contraseñas y datos sensibles
- **cloudinary** (^1.41.3) – Servicio de almacenamiento y optimización de imágenes en la nube
- **cookie-parser** (^1.4.7) – Middleware para parsear cookies HTTP
- **cors** (^2.8.5) – Manejo de políticas de intercambio de recursos entre orígenes
- **dotenv** (^16.6.1) – Gestión de variables de entorno
- **express** (^5.1.0) – Framework web para Node.js
- **jsonwebtoken** (^9.0.2) – Autenticación y autorización mediante JWT
- **mongoose** (^8.16.1) – ODM para MongoDB
- **morgan** (^1.10.0) – Logger HTTP para debugging y monitoreo
- **multer** (^2.0.1) – Middleware para manejo de archivos multipart/form-data
- **multer-storage-cloudinary** (^4.0.0) – Integración de Multer con Cloudinary
- **nodemailer** (^7.0.4) – Envío de correos electrónicos
- **validator** (^13.15.15) – Validación de datos de entrada

### Frontend
- 🖥️ **React.js** – Librería para construir una interfaz de usuario interactiva y moderna.
- ⚡ **Vite** – Herramienta de desarrollo rápida y moderna para aplicaciones web con Hot Module Replacement (HMR)

---

## ⚙️ Configuración del Entorno

### Variables de Entorno (.env)
Asegúrate de crear un archivo `.env` en el directorio del backend con las siguientes variables:

```
# Base de datos
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Puertos
PORT=5000
```

### Instalación

1. **Clonar el repositorio:**
```bash
git clone [url-del-repositorio]
cd IdeartSv
```

2. **Instalar dependencias del backend:**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend:**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno:**
   - Crear archivo `.env` en el directorio `backend/`
   - Completar con las variables necesarias

5. **Ejecutar el proyecto:**
```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend (con Vite)
cd frontend
npm run dev
```

---

## 🧱 Estructura del Proyecto

El repositorio se organiza en dos grandes secciones: **Frontend** y **Backend**, que se desarrollan y ejecutan de manera independiente, pero se comunican a través de una **API RESTful**.

### 🔙 Backend (Node.js + Express + MongoDB)
El backend maneja toda la lógica del servidor, autenticación de usuarios, gestión de productos personalizados y operaciones CRUD sobre la base de datos. Incluye funcionalidades como:
- Autenticación JWT
- Subida de archivos a Cloudinary
- Envío de correos electrónicos
- Validación de datos
- Logging de peticiones HTTP

### 🖼️ Frontend (React + Vite)
El frontend de IdeartSv está construido con React y Vite, ofreciendo una interfaz visualmente atractiva, amigable y adaptada a dispositivos móviles. Vite proporciona un entorno de desarrollo ultra-rápido con Hot Module Replacement, lo que mejora significativamente la experiencia de desarrollo. Su enfoque principal es una experiencia de usuario intuitiva y centrada en la personalización.

---

## 👥 Público Objetivo

- Personas interesadas en servicios de estampado en prendas de vestir mediante DTF textil.
- Clientes que buscan corte de detalles personalizados en vinilos adhesivos y textiles.
- Usuarios que desean stickers personalizados en vinil adhesivo para decoración, branding o eventos.

---

## 📊 Objetivos del Proyecto

- Desarrollar dos plataformas (web y móvil) con un diseño creativo usando MERN.
- Brindar a los usuarios herramientas intuitivas para personalizar artículos en línea.
- Incorporar tendencias modernas en diseño y tecnología para la personalización de productos.
- Posicionar a IdeartSv como una marca referente en artículos personalizados en El Salvador.

---

## 🧑‍💻 Equipo de Desarrollo

Este proyecto fue desarrollado con dedicación y pasión por el siguiente equipo:

- 👨‍💻 César Geovany Landaverde Larios   
- 👩‍💻 Luz María Gasparío Méndez  
- 👩‍💻 Doris Abigail Manzano González  
- 👨‍💻 Jason Alessandro Méndez Blanco  
- 👨‍💻 Jesús Stanley Arce Dueñas  

---

## 📄 Licencia

Este proyecto está protegido por una **licencia exclusiva** con fines comerciales. No está permitido su uso, distribución ni modificación sin autorización expresa del equipo de desarrollo original.
