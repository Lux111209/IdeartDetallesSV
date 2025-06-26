import TerminosSection from '../components/TermsSection'
import TerminosList from '../components/TermsList'

import {
  PackageCheck,
  Brush,
  DollarSign,
  Truck,
  Undo2,
  AlertTriangle,
  FileEdit,
  Mail
} from 'lucide-react'

export default function TermsAndConditions() {
  return (
    <main className="bg-gray-50 py-10 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 text-gray-800">
        <h1 className="text-3xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <FileEdit className="w-8 h-8 text-green-600" />
          Términos y Condiciones
        </h1>

        <p>
          Bienvenido/a a <strong>Ideart Detalles</strong>. Al acceder y utilizar nuestro sitio web y servicios, aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente.
        </p>

        <TerminosSection icon={PackageCheck} title="Sobre Nuestros Servicios">
          <p>
            Nos especializamos en artículos personalizados mediante sublimación y estampado. Incluye camisetas, tazas, cojines, llaveros, y otros regalos personalizados.
          </p>
        </TerminosSection>

        <TerminosSection icon={Brush} title="Proceso de Pedido y Personalización">
          <TerminosList
            items={[
              <><strong>Diseño:</strong> El cliente debe proporcionar imágenes o ideas claras y en alta calidad.</>,
              <><strong>Aprobación:</strong> Se puede enviar una previsualización para revisión antes de la producción final.</>,
              <><strong>Derechos de autor:</strong> El cliente debe tener los derechos sobre los diseños proporcionados.</>,
            ]}
          />
        </TerminosSection>

        <TerminosSection icon={DollarSign} title="Precios y Pagos">
          <TerminosList
            items={[
              <><strong>Precios:</strong> Varían según el tipo de artículo, diseño y cantidad.</>,
              <><strong>Métodos de pago:</strong> Según los indicados en el sitio web, en USD.</>,
              <><strong>Confirmación:</strong> El pedido inicia tras el pago confirmado.</>,
            ]}
          />
        </TerminosSection>

        <TerminosSection icon={Truck} title="Envíos y Entregas">
          <TerminosList
            items={[
              <><strong>Producción:</strong> El tiempo puede variar, se informará al hacer el pedido.</>,
              <><strong>Opciones de envío:</strong> Se muestran al finalizar la compra, calculado según destino y peso.</>,
              <><strong>Responsabilidad:</strong> Una vez entregado al transporte, ellos asumen responsabilidad.</>,
              <><strong>Dirección:</strong> Verifica que sea correcta; no nos responsabilizamos por errores del cliente.</>,
            ]}
          />
        </TerminosSection>

        <TerminosSection icon={Undo2} title="Política de Devoluciones y Reembolsos">
          <TerminosList
            items={[
              <><strong>Artículos personalizados:</strong> No se aceptan devoluciones salvo error de nuestra parte.</>,
              <><strong>Error nuestro:</strong> Notificar en 3 días hábiles con fotos para evaluación y solución.</>,
              <><strong>Error del cliente:</strong> No aplica reembolso si se aprobó un diseño con error del cliente.</>,
            ]}
          />
        </TerminosSection>

        <TerminosSection icon={AlertTriangle} title="Limitación de Responsabilidad">
          <p>
            Ideart Detalles no se responsabiliza por daños indirectos, especiales o incidentales derivados del uso de nuestros productos o servicios.
          </p>
        </TerminosSection>

        <TerminosSection icon={FileEdit} title="Modificaciones de los Términos">
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos tras su publicación en el sitio web.
          </p>
        </TerminosSection>

        <TerminosSection icon={Mail} title="Contacto">
          <p>
            Si tienes preguntas, contáctanos vía{' '}
            <a
              href="mailto:idea.artesv@gmail.com"
              className="text-blue-600 underline hover:text-blue-800 focus:outline-none"
            >
              idea.artesv@gmail.com
            </a>{' '}
            o al <strong>6025-2769</strong>.
          </p>
        </TerminosSection>
      </div>
    </main>
  )
}
