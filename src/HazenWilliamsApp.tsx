import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const materials = {
  "Acero sin costura": 120,
  "Acero soldado en espiral": 100,
  "Cobre sin costura": 150,
  "Concreto": 110,
  "Fibra de vidrio": 150,
  "Hierro fundido": 100,
  "Hierro dúctil con revestimiento": 140,
  "Hierro galvanizado": 100,
  "Polietileno": 140,
  "PVC": 150,
};

function calculateDiameter(Q_m3s, targetVelocity = 1) {
  return Math.sqrt((4 * Q_m3s) / (Math.PI * targetVelocity));
}

function calculateVelocity(Q_m3s, D) {
  return (4 * Q_m3s) / (Math.PI * Math.pow(D, 2));
}

function calculateHeadLoss(Q_m3s, D, C, L = 1000) {
  const Q_lps = Q_m3s * 1000;
  const D_mm = D * 1000;
  const hf_per_km = (10.67 * Math.pow(Q_lps, 1.852)) / (Math.pow(C, 1.852) * Math.pow(D_mm, 4.87));
  return hf_per_km * (L / 1000);
}

export default function HazenWilliamsApp() {
  const [flow, setFlow] = useState(10);
  const [unit, setUnit] = useState("lps");
  const [material, setMaterial] = useState("PVC");
  const [length, setLength] = useState(1000);

  const C = materials[material];
  const Q_m3s = unit === "lps" ? flow / 1000 : flow;
  const D = calculateDiameter(Q_m3s);
  const velocity = calculateVelocity(Q_m3s, D);
  const headLoss = calculateHeadLoss(Q_m3s, D, C, length);

  const chartData = Array.from({ length: 50 }, (_, i) => {
    const d = 0.02 + i * 0.005;
    return {
      diameter: d.toFixed(3),
      velocity: calculateVelocity(Q_m3s, d),
    };
  });

  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-4">
      <Card>
        <CardContent className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Caudal</Label>
              <Input
                type="number"
                value={flow}
                onChange={(e) => setFlow(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Unidad</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lps">L/s</SelectItem>
                  <SelectItem value="m3s">m³/s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Material de la tubería</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(materials).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Longitud del tramo (m)</Label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Coeficiente C: <strong>{C}</strong></div>
            <div>Diámetro recomendado: <strong>{D.toFixed(3)} m</strong></div>
            <div>Velocidad: <strong>{velocity.toFixed(2)} m/s</strong></div>
            <div>Pérdida de carga: <strong>{headLoss.toFixed(2)} m</strong></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Curva de velocidad vs diámetro</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="diameter" label={{ value: 'Diámetro (m)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Velocidad (m/s)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}