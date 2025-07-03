export default function TerminosList({ items }) {
  return (
    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
      {items.map((item, idx) => (
        <li key={idx}>
          {typeof item === "string" ? item : <>{item}</>}
        </li>
      ))}
    </ul>
  )
}
