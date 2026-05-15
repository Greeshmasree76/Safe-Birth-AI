import { useEffect, useState } from "react";
import axios from "axios";
import Charts from "../components/Charts";

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, highRisk: 0, normal: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/patients").then((res) => {
      const data = res.data;
      setStats({
        total: data.length,
        highRisk: data.filter((p) => p.outcome === "High C-Section Risk").length,
        normal: data.filter((p) => p.outcome !== "High C-Section Risk").length,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Charts stats={stats} />
    </div>
  );
}