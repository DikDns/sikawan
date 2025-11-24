import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pager } from '@/components/ui/pagination'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Superadmin', href: '/superadmin/logs' },
]

export default function SuperadminLogs() {
  const { logs, filters } = usePage().props as any
  const [userId, setUserId] = useState<string>(filters?.applied?.user_id || 'all')
  const [model, setModel] = useState<string>(filters?.applied?.model || 'all')
  const [start, setStart] = useState<string>(filters?.applied?.start_date || '')
  const [end, setEnd] = useState<string>(filters?.applied?.end_date || '')

  const applyFilters = (page?: number) => {
    const query: any = {
      user_id: userId && userId !== 'all' ? userId : undefined,
      model: model && model !== 'all' ? model : undefined,
      start_date: start || undefined,
      end_date: end || undefined,
    }
    if (page) query.page = page
    router.get('/superadmin/logs', query, { preserveScroll: true, preserveState: true })
  }


  const handleDelete = (id: number) => {
    router.delete(`/superadmin/logs/activity/${id}`, { preserveScroll: true })
  }

  const pageChange = (p: number) => applyFilters(p)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Audit Logs" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Audit Logs</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm">User</label>
                <Select value={userId} onValueChange={(val) => setUserId(val || 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {filters?.users?.map((u: any) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Model</label>
                <Select value={model} onValueChange={(val) => setModel(val || 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {filters?.models?.map((m: any, idx: number) => (
                      <SelectItem key={idx} value={m.value}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Mulai</label>
                <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Selesai</label>
                <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="secondary" onClick={() => applyFilters()}>Terapkan</Button>
              <Button variant="ghost" onClick={() => { setUserId('all'); setModel('all'); setStart(''); setEnd(''); applyFilters() }}>Reset</Button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs?.data?.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-sm">{row.created_at}</TableCell>
                      <TableCell className="text-sm">{row.user_name || '-'}</TableCell>
                      <TableCell className="text-sm">{row.action}</TableCell>
                      <TableCell className="text-sm">{row.entity_type?.split('\\').pop()}</TableCell>
                      <TableCell className="text-sm">{row.entity_id ?? '-'}</TableCell>
                      <TableCell className="text-sm">
                        <details>
                          <summary className="cursor-pointer">Lihat</summary>
                          <pre className="mt-2 max-h-64 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(row.metadata_json, null, 2)}</pre>
                        </details>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pager
                page={logs?.current_page || 1}
                pageCount={logs?.last_page || 1}
                onChange={pageChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}