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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Failed to get prediction. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏠 House Price Predictor</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input label="Area (sqft)" name="area_sqft" value={form.area_sqft} onChange={handleChange} />
          <Input label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
          <Input label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
          <Input label="Floors" name="floors" value={form.floors} onChange={handleChange} />
          <Input label="House Age" name="house_age" value={form.house_age} onChange={handleChange} />
          <Input label="Distance from City (km)" name="distance_city_km" value={form.distance_city_km} onChange={handleChange} />

          <button style={styles.button} disabled={loading}>
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {prediction !== null && (
          <div style={styles.result}>
            💰 Estimated Price: <strong>{prediction}</strong>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        type="number"
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f8"
}
,
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color:"#111"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
 inputGroup: {
  display: "flex",
  flexDirection: "column",
  fontSize: "14px",
  color: "#111"   // 👈 ADD THIS
},

  input: {
    padding: "8px",
    marginTop: "4px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    background: "#3b8951",
    borderRadius: "6px"
  },
  error: {
    marginTop: "15px",
    color: "red",
    fontSize: "14px"
  }
};

export default App;
