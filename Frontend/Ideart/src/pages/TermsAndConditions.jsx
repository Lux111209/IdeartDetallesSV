import TerminosSection from '../components/TermsSection';
import TerminosList from '../components/TermsList';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";

import {
  PackageCheck,
  Brush,
  DollarSign,
  Truck,
  Undo2,
  AlertTriangle,
  FileEdit,
  Mail
} from 'lucide-react';

import '../css/TermsAndConditions.css';

export default function TermsAndConditions() {
  return (
    <>
      {/* Barra superior con info rápida */}
      <TopBar />
      {/* Navegación principal */}
      <Navbar />

      {/* Contenedor principal de términos */}
      <main className="terms-main">
        <div className="terms-container">
          {/* Título principal con ícono */}
          <h1 className="terms-title">
            <FileEdit className="icon" />
            Términos y Condiciones
          </h1>

          {/* Introducción breve */}
          <p className="terms-text">
            Bienvenido/a a <strong>Ideart Detalles</strong>. Al acceder y utilizar nuestro sitio web y servicios,
            aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente.
          </p>

          {/* Sección: Sobre servicios */}
          <TerminosSection icon={PackageCheck} title="Sobre Nuestros Servicios">
            <p className="terms-text">
              Nos especializamos en artículos personalizados mediante sublimación y estampado. Incluye camisetas,
              tazas, cojines, llaveros, y otros regalos personalizados.
            </p>
          </TerminosSection>

          {/* Sección: Proceso de pedido con lista de puntos */}
          <TerminosSection icon={Brush} title="Proceso de Pedido y Personalización">
            <TerminosList
              items={[
                <span><strong>Diseño:</strong> El cliente debe proporcionar imágenes o ideas claras y en alta calidad.</span>,
                <span><strong>Aprobación:</strong> Se puede enviar una previsualización para revisión antes de la producción final.</span>,
                <span><strong>Derechos de autor:</strong> El cliente debe tener los derechos sobre los diseños proporcionados.</span>
              ]}
            />
          </TerminosSection>

          {/* Sección: Precios y pagos */}
          <TerminosSection icon={DollarSign} title="Precios y Pagos">
            <TerminosList
              items={[
                <span><strong>Precios:</strong> Varían según el tipo de artículo, diseño y cantidad.</span>,
                <span><strong>Métodos de pago:</strong> Según los indicados en el sitio web, en USD.</span>,
                <span><strong>Confirmación:</strong> El pedido inicia tras el pago confirmado.</span>
              ]}
            />
          </TerminosSection>

          {/* Sección: Envíos y entregas */}
          <TerminosSection icon={Truck} title="Envíos y Entregas">
            <TerminosList
              items={[
                <span><strong>Producción:</strong> El tiempo puede variar, se informará al hacer el pedido.</span>,
                <span><strong>Opciones de envío:</strong> Se muestran al finalizar la compra, calculado según destino y peso.</span>,
                <span><strong>Responsabilidad:</strong> Una vez entregado al transporte, ellos asumen responsabilidad.</span>,
                <span><strong>Dirección:</strong> Verifica que sea correcta; no nos responsabilizamos por errores del cliente.</span>
              ]}
            />
          </TerminosSection>

          {/* Sección: Política de devoluciones */}
          <TerminosSection icon={Undo2} title="Política de Devoluciones y Reembolsos">
            <TerminosList
              items={[
                <span><strong>Artículos personalizados:</strong> No se aceptan devoluciones salvo error de nuestra parte.</span>,
                <span><strong>Error nuestro:</strong> Notificar en 3 días hábiles con fotos para evaluación y solución.</span>,
                <span><strong>Error del cliente:</strong> No aplica reembolso si se aprobó un diseño con error del cliente.</span>
              ]}
            />
          </TerminosSection>

          {/* Sección: Limitación de responsabilidad */}
          <TerminosSection icon={AlertTriangle} title="Limitación de Responsabilidad">
            <p className="terms-text">
              Ideart Detalles no se responsabiliza por daños indirectos, especiales o incidentales derivados del uso de nuestros productos o servicios.
            </p>
          </TerminosSection>

          {/* Sección: Modificaciones */}
          <TerminosSection icon={FileEdit} title="Modificaciones de los Términos">
            <p className="terms-text">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos tras su publicación en el sitio web.
            </p>
          </TerminosSection>

          {/* Sección: Contacto */}
          <TerminosSection icon={Mail} title="Contacto">
            <p className="terms-text">
              Si tienes preguntas, contáctanos vía{' '}
              <a href="mailto:idea.artesv@gmail.com" className="terms-link">
                idea.artesv@gmail.com
              </a>{' '}
              o al <strong>6025-2769</strong>.
            </p>
          </TerminosSection>
        </div>
      </main>

      {/* Pie de página */}
      <Footer />
    </>
  );
}
