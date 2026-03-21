import QRCode from "qrcode";

export const generateQR = async (req, res) => {
  try {
    const { tableId } = req.params;
    const restaurantId = req.restaurantId; // from JWT middleware

    if (!tableId || !restaurantId) {
      return res.status(400).json({ message: "Missing params" });
    }

    const url = `https://qrreso.onrender.com:/r/${restaurantId}/${tableId}`;

    const qrImage = await QRCode.toDataURL(url);

    res.json({ qrImage });
  } catch (error) {
    console.error("QR Error:", error);
    res.status(500).json({ message: "QR generation failed" });
  }
};