import { Card, CardContent } from "@/components/ui/card"
import { Users, Users2 } from "lucide-react"

export function BottomStats({ data }: { data?: { population: number; kk: number } }) {
  const population = data?.population ?? 40689
  const kk = data?.kk ?? 40689
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Jumlah Penduduk</p>
              <p className="text-2xl font-bold text-foreground">{population.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Jumlah KK</p>
              <p className="text-2xl font-bold text-foreground">{kk.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Users2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
