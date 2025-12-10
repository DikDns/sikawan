import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { router, usePage } from "@inertiajs/react";
import HouseholdCharts from "@/components/report/household-status-chart";
import HouseholdLineChart from "@/components/report/household-line-chart";
import InfrastructureBarChart from "@/components/report/infrastructure-bar-chart";
import dayjs from "dayjs";

export function Section({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold border-b pb-1 mt-6 mb-2">{title}</h2>
  );
}

export function TableBasic({
  headers,
  rows,
}: {
  headers: string[];
  rows?: (React.ReactNode[] | string[])[];
}) {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <Table className="w-full border rounded-md">
      <TableHeader>
        <TableRow>
          {headers.map((h, i) => (
            <TableHead key={i} className="px-2 py-2 text-xs font-semibold">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {hasRows ? (
          rows!.map((cols, i) => (
            <TableRow key={i}>
              {cols.map((c, j) => (
                <TableCell
                  key={j}
                  className="px-2 py-2 text-xs align-top break-words whitespace-pre-line"
                  style={{ wordBreak: "break-word", maxWidth: 180 }}
                >
                  {c}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="text-center text-sm text-muted-foreground"
            >
              Tidak ada data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

type HouseholdRow = {
  head_name?: string;
  address_text?: string;
  habitability_status?: string | null;
  member_total?: number | string;
  survey_date?: string | null;
};

type PsuRow = {
  name?: string;
  category?: string;
  type?: string;
  infrastructure_count?: number | string;
};

type AreaRow = {
  name?: string;
  description?: string | string;
  infrastructure_count?: number | string;
};

type PreviewProps = {
  title?: string;
  type?: "RUMAH" | "PSU" | "KAWASAN" | "UMUM";
  description?: string | null;
  start?: string | null;
  end?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

function formatDate(date: string | null) {
  return date ? dayjs(date).format("DD MMM YYYY") : "Semua";
}

export default function PdfPreview() {
  const { props } = usePage<PreviewProps>();

  const title = props.title ?? "Preview Laporan";
  const type = props.type ?? "RUMAH";
  const description = props.description ?? "";
  const start = props.start ?? null;
  const end = props.end ?? null;
  const rawData = props.data ?? null;

  const formatLongDate = (dateString?: string | null) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();

    return `${day} - ${month} - ${year}`;
  };

  // Table headers & rows
  let tableHeaders: string[] = [];
  let rows: (React.ReactNode[] | string[])[] = [];

  if (type === "RUMAH" && Array.isArray(rawData)) {
    tableHeaders = [
      "Nama Kepala",
      "Alamat",
      "Status",
      "Jiwa",
      "Tanggal Survey",
    ];
    rows = rawData.map((h: HouseholdRow) => [
      h.head_name ?? "-",
      h.address_text ?? "-",
      h.habitability_status ?? "-",
      String(h.member_total ?? "-"),
      h.survey_date ? formatLongDate(h.survey_date) : "-",
    ]);
  }

  if (type === "PSU" && Array.isArray(rawData)) {
    tableHeaders = ["Nama", "Kategori", "Tipe", "Total Infrastruktur"];
    rows = rawData.map((p: PsuRow) => [
      p.name ?? "-",
      p.category ?? "-",
      p.type ?? "-",
      String(p.infrastructure_count ?? "-"),
    ]);
  }

  if (type === "KAWASAN" && Array.isArray(rawData)) {
    tableHeaders = ["Nama Kawasan", "Total Rumah", "Total PSU"];
    rows = rawData.map((a: AreaRow) => [
      a.name ?? "-",
      String(a.description ?? "-"),
      String(a.infrastructure_count ?? "-"),
    ]);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 bg-white">
      <div className="mt-4 flex justify-start">
        <Button
          variant="destructive"
          onClick={() => router.visit("/reports")}
          className="text-xs"
        >
          ← Kembali
        </Button>
      </div>
      <Card className="shadow-none border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Jenis: <b>{type}</b> — Periode:{" "}
            <b>{formatDate(start)}</b> - <b>{formatDate(end)}</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {description && (
            <p className="mb-4 text-sm whitespace-pre-line break-words">
              {description}
            </p>
          )}

          {/* chart section */}
          {type === "RUMAH" && Array.isArray(rawData) && (
            <>
              <Section title="Grafik Status Rumah" />
              <div className="w-full mb-4">
                <HouseholdCharts houses={rawData} />
              </div>
              <Section title="Grafik Perkembangan Rumah" />
              <div className="w-full mb-4">
                <HouseholdLineChart houses={rawData} />
              </div>
            </>
          )}

          {type === "PSU" && Array.isArray(rawData) && (
            <>
              <Section title="Grafik Infrastruktur" />
              <div className="w-full mb-4">
                <InfrastructureBarChart infrastructures={rawData} />
              </div>
            </>
          )}

          {type === "UMUM" && rawData && (
            <>
              <Section title="Grafik Status Rumah" />
              <div className="w-full mb-4">
                <HouseholdCharts houses={rawData.houses ?? []} />
              </div>
              <Section title="Grafik Perkembangan Rumah" />
              <div className="w-full mb-4">
                <HouseholdLineChart houses={rawData.houses ?? []} />
              </div>
              <Section title="Grafik Infrastruktur" />
              <div className="w-full mb-4">
                <InfrastructureBarChart infrastructures={rawData.psu ?? []} />
              </div>
            </>
          )}

          {/* Table Section */}
          <Section title="Data Laporan" />
          {type === "UMUM" ? (
            <>
              <Section title="Rumah" />
              <TableBasic
                headers={["Nama Kepala", "Alamat", "Status", "Total Jiwa", "Tanggal Survey"]}
                rows={
                  Array.isArray(rawData?.houses)
                    ? rawData.houses.map((h: HouseholdRow) => [
                        h.head_name ?? "-",
                        h.address_text ?? "-",
                        h.habitability_status ?? "-",
                        h.member_total ?? "-",
                        formatLongDate(h.survey_date) ?? "-",
                      ])
                    : []
                }
              />
              <Section title="PSU" />
              <TableBasic
                headers={["Nama", "Kategori", "Jenis", "Total Infrastruktur"]}
                rows={
                  Array.isArray(rawData?.psu)
                    ? rawData.psu.map((p: PsuRow) => [
                        p.name ?? "-",
                        p.category ?? "-",
                        p.type ?? "-",
                        p.infrastructure_count ?? "-",
                      ])
                    : []
                }
              />
              <Section title="Kawasan" />
              <TableBasic
                headers={["Nama Kawasan", "Total Rumah"]}
                rows={
                  Array.isArray(rawData?.areas)
                    ? rawData.areas.map((a: AreaRow) => [
                        a.name ?? "-",
                        String(a.description ?? "-"),
                      ])
                    : []
                }
              />
            </>
          ) : (
            <TableBasic headers={tableHeaders} rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
