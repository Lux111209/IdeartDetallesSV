import {config} from "../../config.js";
export const getToken = async (req, res) => {
  try {
    const response = await fetch("https://id-sandbox.wompi.sv/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:config.WOMPI.GRANT_TYPE,
        client_id:config.WOMPI.CLIENT_ID,
        client_secret:config.WOMPI.CLIENT_SECRET, 
        audience:config.WOMPI.AUDIENCE ,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener token" });
  }
};

//  Pago de prueba (sin 3DS)
export const testPayment = async (req, res) => {
  try {
    const { token, formData } = req.body;

    if (!token) return res.status(400).json({ error: "Token requerido" });
    if (!formData) return res.status(400).json({ error: "Datos requeridos" });

    const response = await fetch(
      "https://api-sandbox.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();

    // Log para verificar la transacción
    console.log("🟢 Transacción procesada (SANDBOX):", {
      status: data.status,
      mensaje: data.mensaje,
      idTransaccion: data.idTransaccion,
      raw: data
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

// Pago real con 3DS
export const payment3ds = async (req, res) => {
  try {
    const { token, formData } = req.body;

    if (!token) return res.status(400).json({ error: "Token requerido" });
    if (!formData) return res.status(400).json({ error: "Datos requeridos" });

    const response = await fetch("https://api-sandbox.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log("🔴 Error en transacción 3DS (SANDBOX):", error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();

    // Log para verificar la transacción 3DS
    console.log("🟢 Transacción 3DS procesada (SANDBOX):", {
      status: data.status,
      mensaje: data.mensaje,
      idTransaccion: data.idTransaccion,
      raw: data
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};