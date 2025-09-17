import fetch from 'node-fetch';
import Ventas from '../models/Ventas.js';

// SE CREA UNA TRANSACCION DE PAGO
export const createPayment = async (req, res) => {
  try {
    const {
      monto, nombre, apellido, email, ciudad,
      direccion, codigoPostal, telefono, idShoppingCart
    } = req.body;

    if (!monto || !nombre || !apellido || !email || !idShoppingCart) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Llamada al API de Wompi (tarjeta no se guarda en DB)
    const response = await fetch("https://endpoint-wompi/TransaccionCompra/3DS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tarjetaCreditoDebido: req.body.tarjetaCreditoDebido, // solo para enviar a Wompi
        monto,
        urlRedirect: "http://localhost:3000/pagos/confirmacion",
        nombre,
        apellido,
        email,
        ciudad,
        direccion,
        idPais: "SV",
        idRegion: "SV-SS",
        codigoPostal,
        telefono,
        configuracion: { urlWebhook: "https://tu-backend.com/api/pagos/webhook" }
      })
    });

    const data = await response.json();

    // Guardamos solo info necesaria
    const nuevaVenta = await Ventas.create({
      idShoppingCart,
      direccion,
      metodoPago: "tarjeta",
      statusPago: "pendiente",
      statusTransaccion: "procesando",
      idTransaccion: data.idTransaccion,
      monto,
      nombre,
      apellido,
      email,
      telefono,
      ciudad,
      codigoPostal,
      idPais: "SV",
      idRegion: "SV-SS",
      rawResponse: data
    });

    res.json({
      venta: nuevaVenta,
      urlPago3DS: data.urlCompletarPago3Ds
    });

  } catch (error) {
    console.error("Error creando transacción:", error.message);
    res.status(500).json({ error: "Error creando transacción" });
  }
};

// Webhook para actualizar estado de la venta
export const paymentWebhook = async (req, res) => {
  try {
    const { idTransaccion, estado } = req.body;

    const ventaActualizada = await Ventas.findOneAndUpdate(
      { idTransaccion },
      {
        statusPago: estado === "APPROVED" ? "completado" : "fallido",
        statusTransaccion: estado === "APPROVED" ? "completada" : "cancelada",
        rawResponse: req.body
      },
      { new: true }
    );

    if (!ventaActualizada) return res.status(404).json({ error: "Venta no encontrada" });

    console.log(`Webhook procesado: ${idTransaccion} -> ${estado}`);
    res.sendStatus(200);

  } catch (error) {
    console.error("Error en webhook:", error.message);
    res.sendStatus(500);
  }
};
