import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type PreviewProps = {
  title?: string;
  type?: "RUMAH" | "PSU" | "KAWASAN" | "UMUM";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSheets(type: string, data: any) {
  if (type === "UMUM") {
    return [
      {
        key: "RUMAH",
        label: "Rumah",
        data: data?.houses ?? []
      },
      {
        key: "PSU",
        label: "PSU",
        data: data?.psu ?? []
      },
      {
        key: "KAWASAN",
        label: "Kawasan",
        data: data?.areas ?? []
      },
    ];
  }
  return [
    {
      key: type,
      label: type.charAt(0) + type.slice(1).toLowerCase(),
      data
    },
  ];
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExcelTable({ data }: { data: any[] }) {
  if (!Array.isArray(data) || data.length === 0)
    return (
      <div className="text-center text-muted-foreground py-8">
        Tidak ada data.
      </div>
    );

  const headers = Object.keys(data[0] ?? {});

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead
              key={h}
              className="border bg-gray-100 px-2 py-2 text-xs font-semibold"
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {headers.map((h) => (
              <TableCell
                key={h}
                className="border px-2 py-2 text-xs break-words whitespace-pre-line"
                style={{ maxWidth: 220 }}
              >
                {row[h] ?? ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ExcelPreview() {
  const { props } = usePage<PreviewProps>();
  const title = props.title ?? "Preview Excel";
  const type = props.type ?? "RUMAH";
  const data = props.data ?? [];

  const sheets = getSheets(type, data);
  const [activeTab, setActiveTab] = useState(sheets[0]?.key);

  return (
    <div className="p-6 max-w-5xl my-8 mx-auto bg-white border rounded">
      <div className="mb-4 flex justify-between items-center">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => router.visit("/reports")}
        >
          ← Kembali
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <Card>
        <CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-2">
              {sheets.map((sheet) => (
                <TabsTrigger key={sheet.key} value={sheet.key}>
                  {sheet.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {sheets.map((sheet) => (
              <TabsContent key={sheet.key} value={sheet.key}>
                <CardContent className="overflow-x-auto max-w-[920px] p-0">
                  <ExcelTable data={sheet.data} />
                </CardContent>
              </TabsContent>
            ))}
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
