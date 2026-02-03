import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    house_age: "",
    distance_city_km: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          area_sqft: Number(form.area_sqft),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          floors: Number(form.floors),
          house_age: Number(form.house_age),
          distance_city_km: Number(form.distance_city_km)
        })
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 500 }}>
      <h2>🏠 House Price Predictor</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={form[key]}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
      ))}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      {prediction !== null && (
        <h3>Predicted Price: {prediction}</h3>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
