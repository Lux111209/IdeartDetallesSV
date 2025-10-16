import PaymentRecord from "../models/PaymentRecord.js";
// En Node 18+ fetch ya está disponible globalmente

// Claves de Wompi (usa las tuyas)
const WOMPI_PUBLIC_KEY = "pub_test_xxxxxxxxx";
const WOMPI_PRIVATE_KEY = "prv_test_xxxxxxxxx";
const WOMPI_BASE_URL = "https://api.wompi.sv";

// Crear registro y generar link de pago
const createPaymentRecord = async (req, res) => {
  try {
    const { userName, paymentMethod, amountInCents, currency } = req.body;

    if (!userName || !paymentMethod || !amountInCents || !currency) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const wompiResponse = await fetch(`${WOMPI_BASE_URL}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Pago de ${userName}`,
        description: `Método de pago: ${paymentMethod}`,
        currency,
        amount_in_cents: amountInCents,
        single_use: true,
        redirect_url: "https://ideart-detalles-sv-six.vercel.app/confirmacion",
      }),
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error(wompiData);
      return res.status(500).json({ message: "Error al generar link de pago" });
    }

    const paymentLink = wompiData.data.url;

    const newRecord = new PaymentRecord({
      userName,
      paymentMethod,
      paymentLink,
    });

    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear registro de pago" });
  }
};

// Obtener todos los registros
const getAllPaymentRecords = async (req, res) => {
  try {
    const records = await PaymentRecord.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registros" });
  }
};

// Actualizar registro
const updatePaymentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PaymentRecord.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Registro no encontrado" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar registro" });
  }
};

// Eliminar registro
const deletePaymentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentRecord.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Registro no encontrado" });
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar registro" });
  }
};

// ✅ Constante con array de funciones
const paymentFunctions = [
  createPaymentRecord,
  getAllPaymentRecords,
  updatePaymentRecord,
  deletePaymentRecord,
];

// ✅ Exportación por defecto
export default paymentFunctions;
