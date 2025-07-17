import { ReactNode } from "react"

// Componente para la sección de términos
export default function TerminosSection({ icon: Icon, title, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-green-700">
        <Icon className="w-5 h-5" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </section>
  )
}
