import React from 'react';
import { BarChart3, Mountain, Cpu, ShieldCheck, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Analytics() {
  const terrainCostData = [
    { terrain: 'Plain', avgCostPerKm: 12.5, maxCostPerKm: 18.0 },
    { terrain: 'Hilly', avgCostPerKm: 18.2, maxCostPerKm: 24.5 },
    { terrain: 'Mountain', avgCostPerKm: 29.4, maxCostPerKm: 35.0 },
    { terrain: 'Remote', avgCostPerKm: 22.0, maxCostPerKm: 28.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" /> Terrain-Aware Analytics & ML Service Insights
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comparative benchmarks for cost per km, Isolation Forest anomaly parameters, and duplicate image similarity matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terrain Cost Per Km Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Terrain-Adjusted Road Cost Benchmarks (₹ Lakh / Km)</h3>
            <p className="text-xs text-slate-500">Normalizing costs based on topography to prevent false positive flags on mountain roads</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terrainCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="terrain" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="avgCostPerKm" name="Average Cost (₹ Lakh/Km)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maxCostPerKm" name="Threshold Limit (₹ Lakh/Km)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ML Feature Weights */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Isolation Forest Feature Weight Importance</h3>
          <div className="space-y-3 text-xs">
            {[
              { feature: 'Expenditure vs Progress Mismatch Ratio', weight: '34%' },
              { feature: 'Geotagged Photo Cosine Embedding Similarity', weight: '26%' },
              { feature: 'Haversine GPS Proximity (< 50m)', weight: '20%' },
              { feature: 'Terrain-Adjusted Unit Cost Overrun', weight: '12%' },
              { feature: 'Milestone Delay & Report Lag', weight: '8%' },
            ].map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{f.feature}</span>
                  <span className="font-mono text-blue-600">{f.weight}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: f.weight }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
