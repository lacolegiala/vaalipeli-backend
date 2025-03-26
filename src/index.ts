import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/municipalities", async (req, res) => {
  try {
    const jsResponse = await axios.get(
      "https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/municipalities2025-Dcea4BZl.js",
      { responseType: "text" }
    );

    const match = jsResponse.data.match(/const municipalities = (\[.*\]);/s);

    if (!match) {
      throw new Error("Failed to extract municipalities");
    }

    const municipalities = JSON.parse(match[1]);

    const apiResponse = await axios.get<MunicipalityFromApi[]>(
      'https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/municipality/constituencies'
    )

    const apiMunicipalities = apiResponse.data

    const municipalityIdMap = new Map(
      apiMunicipalities.map((m: MunicipalityFromApi) => [m.official_id, m.id])
    );

    const transformedData: Municipality = municipalities.map((m: Municipality) => ({
      id: municipalityIdMap.get(m.municipality_id),
      municipality_id: m.municipality_id,
      name_fi: m.name_fi,
      name_sv: m.name_sv,
      county_id: m.county_id, 
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching municipalities", error);
    res.status(500).json({ error: "Failed to fetch municipalities" });
  }
});

app.get('/counties', async (req, res) => {
  try {
    const response = await axios.get<County[]>(
      'https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/county/constituencies'
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching counties', error)
    res.status(500).json({ error: 'Failed to fetch counties' })
  }
})

app.get('/municipality/:id/parties', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get<Party[]>(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/municipality/constituencies/${id}/parties`
    )
    res.json(response.data)
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({ error: "Failed to fetch parties" });
  }
})

app.get('/county/:id/parties', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get<Party[]>(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/county/constituencies/${id}/parties`
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching parties:', error)
    res.status(500).json({ error: 'Failed to fetch parties' })
  }
})

app.get('/municipality/:id/candidate-data', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get<Candidate[]>(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/municipality/constituencies/${id}/candidates`
    )
    res.json(response.data)
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
})

app.get('/county/:id/candidate-data', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get<Candidate[]>(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/county/constituencies/${id}/candidates`
    );
    res.json(response.data)
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
