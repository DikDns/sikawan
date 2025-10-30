"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { name: "Belum Dioperasikan", value: 280, fill: "#ef4444" },
  { name: "Sedang Dioperasikan", value: 0, fill: "#fbbf24" },
  { name: "Selesai", value: 100, fill: "#10b981" },
]

export function ChartSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Perolehan RTUH */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Perolehan RTUH</CardTitle>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">360</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pembangunan Rumah Baru */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pembangunan Rumah Baru</CardTitle>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">360</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Butuh Dibangun", value: 280, fill: "#6366f1" },
                  { name: "Sedang Dibangun", value: 0, fill: "#fbbf24" },
                  { name: "Selesai", value: 100, fill: "#10b981" },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {[{ fill: "#6366f1" }, { fill: "#fbbf24" }, { fill: "#10b981" }].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
