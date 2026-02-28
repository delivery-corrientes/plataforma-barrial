const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SPREADSHEET_ID = "PEGA_AQUI_TU_ID_DE_GOOGLE_SHEET";

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/guardar", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nombre, email, mensaje]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
