import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const economicData = [
  { indicator: "Pendapatan rata-rata", value: "Rp4,2 juta/bulan" },
  { indicator: "Tingkat Pengangguran", value: "5,3%" },
  { indicator: "Tingkat Kemiskinan Mutlak", value: "9.249 jiwa" },
  { indicator: "Akses Pendidikan Dasar", value: "97%" },
  { indicator: "Akses Kesehatan", value: "91%" },
]

export function EconomicDataTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Data Sosial Ekonomi</CardTitle>
        <Button variant="ghost" size="sm" className="gap-2">
          2025
          <ChevronDown className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border font-semibold text-sm">
            <div>Indikator</div>
            <div className="text-right">Nilai</div>
          </div>
          {economicData.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 py-2 text-sm">
              <div className="text-muted-foreground">{item.indicator}</div>
              <div className="text-right font-medium text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
