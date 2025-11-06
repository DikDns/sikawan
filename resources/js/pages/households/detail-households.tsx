"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, FileDown, MapPin, Wrench } from "lucide-react"
import HouseholdMapTab from "@/components/household/map-tab"

interface Household {
  id: number
  head_name: string
  nik: string | null
  address_text: string
  rt_rw: string
  status_mbr: "MBR" | "NON_MBR"
  member_total: number
  male_count: number
  female_count: number
  kk_count: number
  habitability_status: "LAYAK" | "RLH" | "RTLH"
  ownership_status_building: "OWN" | "RENT" | "OTHER"
  latitude: number | null
  longitude: number | null
}

// Mock detailed data
const MOCK_DETAIL_DATA: Record<number, any> = {
  1501341233: {
    generalInfo: {
      rt_rw: "003/012",
      village: "Cipta Jaya",
      district: "Mekarsari",
      province: "Sumatera Selatan",
      ownershipStatus: "Milik Sendiri",
      buildingYear: 2015,
      renovationYear: 2020,
    },
    buildingInfo: {
      landSize: "36 m²",
      buildingSize: "20 m²",
      floors: 1,
      rooms: 2,
      roofMaterial: "Genteng",
      wallMaterial: "Bata & Semen",
      floorMaterial: "Keramik",
      hasRingBalak: "Ada",
      hasRoof: "Ada",
      hasFoundation: "Ada",
    },
    utilities: {
      waterSource: "Ledeng Meteran, Sumur Terlindungi",
      waterDistance: "< 10m",
      electricitySource: "PLN",
      electricityPower: "2200W",
      toiletType: "Jambah Sendiri",
      wastageType: "Leher Angsa",
      kitchenType: "Dapur Tersendiri",
    },
    assistance: [
      {
        date: "20 Maret 2023",
        program: "Peningkatan Kualitas",
        source: "Dana BSPS",
        cost: "Rp 150,000,000",
        status: "Selesai",
      },
    ],
  },
}

const MOCK_HOUSEHOLDS: Record<number, Household> = {
  1501341233: {
    id: 1501341233,
    head_name: "Anastasya Risna T.",
    nik: "1671234567890123",
    address_text: "Jl. Merdeka No. 456, Kel. Cipta Jaya, Kec. Mekarsari",
    rt_rw: "003/012",
    status_mbr: "NON_MBR",
    member_total: 4,
    male_count: 2,
    female_count: 2,
    kk_count: 1,
    habitability_status: "LAYAK",
    ownership_status_building: "OWN",
    latitude: -3.0627,
    longitude: 104.7429,
  },
}

export default function HouseholdDetail() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const householdId = Number.parseInt(id)

  const household = MOCK_HOUSEHOLDS[householdId]
  const detail = MOCK_DETAIL_DATA[householdId]

  if (!household || !detail) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Data rumah tidak ditemukan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Rumah
        </Button>

        {/* Detail Card with Image Background */}
        <Card className="mb-6 border-border shadow-lg overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-secondary to-secondary/80">
            <img
              src="/rumah-tradisional.jpg"
              alt={household.head_name}
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h1 className="text-3xl font-bold text-secondary-foreground mb-2">{household.head_name}</h1>
              <div className="flex items-center gap-2 text-secondary-foreground/90">
                <MapPin className="h-4 w-4" />
                <span>{household.address_text}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <CardContent className="p-6">
            <Tabs defaultValue="umum" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger value="umum" className="text-xs sm:text-sm">
                  Umum
                </TabsTrigger>
                <TabsTrigger value="teknis" className="text-xs sm:text-sm">
                  Data Teknis
                </TabsTrigger>
                <TabsTrigger value="lokasi" className="text-xs sm:text-sm">
                  Lokasi Peta
                </TabsTrigger>
                <TabsTrigger value="bantuan" className="text-xs sm:text-sm">
                  Bantuan
                </TabsTrigger>
              </TabsList>

              {/* Tab: Umum (General Info) */}
              <TabsContent value="umum" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">ID Rumah</h3>
                    <p className="font-semibold text-foreground">{household.id}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">NIK Kepala Keluarga</h3>
                    <p className="font-semibold text-foreground">{household.nik || "-"}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">RT/RW</h3>
                    <p className="font-semibold text-foreground">{household.rt_rw}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Provinsi</h3>
                    <p className="font-semibold text-foreground">{detail.generalInfo.province}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Kelurahan</h3>
                    <p className="font-semibold text-foreground">{detail.generalInfo.village}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Kecamatan</h3>
                    <p className="font-semibold text-foreground">{detail.generalInfo.district}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Status Kepemilikan</h3>
                    <p className="font-semibold text-foreground">{detail.generalInfo.ownershipStatus}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tahun Pembangunan</h3>
                    <p className="font-semibold text-foreground">{detail.generalInfo.buildingYear}</p>
                  </div>
                </div>

                {/* Family Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Informasi Keluarga</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Anggota</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{household.member_total}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Laki-laki</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-secondary">{household.male_count}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Perempuan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-chart-2">{household.female_count}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah KK</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-chart-4">{household.kk_count}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Status Hunian</h3>
                  <div className="flex gap-4">
                    <Badge
                      variant={
                        household.habitability_status === "RTLH"
                          ? "destructive"
                          : household.habitability_status === "LAYAK"
                            ? "default"
                            : "secondary"
                      }
                      className="px-3 py-2 text-base"
                    >
                      {household.habitability_status === "RTLH"
                        ? "Rumah Tidak Layak Huni"
                        : household.habitability_status === "LAYAK"
                          ? "Rumah Layak Huni"
                          : "Rumah Layak Huni (Perlu Perbaikan)"}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-2 text-base">
                      {household.status_mbr}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Data Teknis (Technical Data) */}
              <TabsContent value="teknis" className="mt-6 space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Keteraturan Bangunan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Akses Jalan {"<"}1,5 m</p>
                      <p className="font-semibold text-foreground">Tidak</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Akses Jalan {">"}1,5 m</p>
                      <p className="font-semibold text-foreground">Ya</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Teknis Bangunan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(detail.buildingInfo).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm capitalize text-muted-foreground">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </p>
                        <p className="font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Utilitas</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(detail.utilities).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm capitalize text-muted-foreground">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </p>
                        <p className="font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Lokasi Peta (Map Location) */}
              <TabsContent value="lokasi" className="mt-6">
                <HouseholdMapTab household={household} />
              </TabsContent>

              {/* Tab: Bantuan (Assistance) */}
              <TabsContent value="bantuan" className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Detail Bantuan Perbaikan</h3>
                {detail.assistance && detail.assistance.length > 0 ? (
                  <div className="space-y-4">
                    {detail.assistance.map((aid: any, idx: number) => (
                      <Card key={idx} className="bg-muted border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base text-foreground">{aid.program}</CardTitle>
                              <CardDescription className="mt-1">{aid.date}</CardDescription>
                            </div>
                            <Badge variant="default" className="bg-primary text-primary-foreground">
                              {aid.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Sumber Dana</p>
                            <p className="font-semibold text-foreground">{aid.source}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Biaya</p>
                            <p className="text-xl font-bold text-foreground">{aid.cost}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted border-border">
                    <CardContent className="py-8 text-center">
                      <Wrench className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Belum ada bantuan perbaikan</p>
                    </CardContent>
                  </Card>
                )}

                <Button className="w-full gap-2 mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  <FileDown className="h-4 w-4" />
                  Download Laporan
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
