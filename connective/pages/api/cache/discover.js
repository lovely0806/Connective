const axios = require("axios")

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
        const { data } = await axios.get("https://www.recache.cloud/api/235/121?token=cac121461df5ec95fd867894904f0839b108b03a");
        return res.status(200).json(data)
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}