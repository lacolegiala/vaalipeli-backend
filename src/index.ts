import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/municipalities', async (req, res) => {
  try {
    const response = await axios.get(
      'https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/municipalities2025-Dcea4BZl.js'
    )
    console.log('dsjsjkddjsk', response)
  } catch (error) {
    console.error('Error fetching municipalities', error)
    res.status(500).json({ error: 'Failed to fetch municipalities' })
  }
})

app.get('/counties', async (req, res) => {
  try {
    const response = await axios.get(
      'https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/counties2024-zjuylDAk.js'
    )
    console.log('dsjsjkddjsk', response)
  } catch (error) {
    console.error('Error fetching counties', error)
    res.status(500).json({ error: 'Failed to fetch counties' })
  }
})

app.get('/municipality/:id/parties', async (req, res) => {
  console.log('sajajshj')
  const id = req.params.id
  try {
    const response = await axios.get(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/municipality/constituencies/${id}/parties`
    )
    console.log('ajksajkasjkasjk', response)
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({ error: "Failed to fetch parties" });
  }
})

app.get('/county/:id/candidate-data', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get(
      `https://vaalit.yle.fi/vaalikone/alue-ja-kuntavaalit2025/api/public/county/constituencies/${id}/candidates`
    );
    console.log('djssjkdsdjk', response)
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
