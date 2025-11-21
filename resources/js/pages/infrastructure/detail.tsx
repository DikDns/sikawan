import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getCsrfToken, handleCsrfError } from '@/lib/csrf'
import { InfrastructureFeatureList, type InfrastructureItem } from '@/components/infrastructure/infrastructure-feature-list'
import { InfrastructureFormDialog, type InfrastructureItemForm } from '@/components/infrastructure/infrastructure-form-dialog'
import { InfrastructureMapDisplay, type InfrastructureFeatureGeometry } from '@/components/infrastructure/infrastructure-map-display'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'PSU', href: '/infrastructure' },
  { title: 'Detail PSU', href: '#' },
]

interface InfrastructureGroupProps {
  id: number
  code: string
  name: string
  category: string
  type: 'Marker' | 'Polyline' | 'Polygon'
  legend_color_hex: string
  legend_icon: string | null
  description: string | null
}

interface Props {
  group: InfrastructureGroupProps
  items: InfrastructureItem[]
}

export default function InfrastructureDetail({ group, items }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InfrastructureItemForm | null>(null)
  const [itemsState, setItemsState] = useState<InfrastructureItem[]>(items)
  const [resolvedLayerIds, setResolvedLayerIds] = useState<Record<number, number>>({})
  const createInFlightRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    setItemsState(items)
  }, [items])

  const mapFeatures: InfrastructureFeatureGeometry[] = useMemo(() => (
    itemsState.map((item) => ({
      id: item.id,
      name: item.name,
      geometry_type: item.geometry_type as any,
      geometry_json: typeof item.geometry_json === 'string' ? item.geometry_json as any : JSON.stringify(item.geometry_json),
      color: group.legend_color_hex,
    }))
  ), [itemsState, group.legend_color_hex])

  const handleLayerCreated = useCallback(async (geometry: unknown, layerNumber: number, geometryType: 'Point' | 'LineString' | 'Polygon') => {
    const defaultName = `${group.name} ${layerNumber}`

    try {
      if (createInFlightRef.current.has(layerNumber)) return
      createInFlightRef.current.add(layerNumber)

      const csrfToken = getCsrfToken()
      const payload = { name: defaultName, description: null, geometry_type: geometryType, geometry_json: geometry }

      const response = await fetch(`/infrastructure/${group.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 419) {
          toast.error(handleCsrfError(response, errorData))
          return
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      toast.success(data.message || 'PSU berhasil ditambahkan')
      const created = (data?.data?.item || data?.item)
      if (created && created.id) {
        setItemsState((prev) => [...prev, created])
        setResolvedLayerIds((prev) => ({ ...prev, [layerNumber]: created.id }))
      } else {
        router.reload({ only: ['items'] })
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menyimpan PSU'
      toast.error(msg)
    } finally {
      createInFlightRef.current.delete(layerNumber)
    }
  }, [group.id, group.name])

  const handleFormSuccess = () => {
    router.reload({ only: ['items'] })
    setEditingItem(null)
  }

  const handleItemEditDetail = (item: InfrastructureItem) => {
    setEditingItem({ id: item.id, name: item.name, description: item.description || null, geometry_type: item.geometry_type, geometry_json: item.geometry_json })
    setIsDialogOpen(true)
  }

  const handleItemDelete = useCallback(async (itemId: number) => {
    try {
      const csrfToken = getCsrfToken()
      const response = await fetch(`/infrastructure/${group.id}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      })
      if (!response.ok) {
        const errText = await response.text()
        if (response.status === 419 || errText.includes('CSRF')) {
          toast.error(handleCsrfError(response, { message: errText }))
          return
        }
        throw new Error('Gagal menghapus PSU')
      }
      const data = await response.json().catch(() => ({}))
      toast.success(data.message || 'PSU berhasil dihapus')
      setItemsState((prev) => prev.filter((a) => a.id !== itemId))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menghapus PSU'
      toast.error(msg)
    }
  }, [group.id])

  const handleLayerEdited = useCallback(async (id: number, geometry: unknown, geometryType: 'Point' | 'LineString' | 'Polygon') => {
    try {
      const csrfToken = getCsrfToken()
      const response = await fetch(`/infrastructure/${group.id}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ name: itemsState.find((a) => a.id === id)?.name || '', description: itemsState.find((a) => a.id === id)?.description || null, geometry_type: geometryType, geometry_json: geometry }),
      })
      if (!response.ok) {
        const errText = await response.text()
        if (response.status === 419 || errText.includes('CSRF')) {
          toast.error(handleCsrfError(response, { message: errText }))
          return
        }
        throw new Error(errText || 'Gagal mengedit PSU')
      }
      const data = await response.json().catch(() => ({}))
      toast.success(data.message || 'PSU berhasil diperbarui')
      setItemsState((prev) => prev.map((a) => (a.id === id ? { ...a, geometry_json: geometry } as any : a)))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengedit PSU'
      toast.error(msg)
    }
  }, [group.id, itemsState])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${group.name} - Detail PSU`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: group.legend_color_hex }}>{group.name}</h1>
          {group.description ? (
            <p className="mt-1 text-muted-foreground">{group.description}</p>
          ) : null}
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
          <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Daftar Fitur ({itemsState.length})</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <InfrastructureFeatureList
                  items={itemsState}
                  selectedItemId={selectedId}
                  onItemSelect={(item) => setSelectedId(item.id)}
                  onItemEdit={handleItemEditDetail}
                  className="h-full"
                />
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={70} minSize={50} maxSize={75}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Peta PSU</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <div className="h-full rounded-md border">
                  <InfrastructureMapDisplay
                    type={group.type}
                    features={mapFeatures}
                    defaultColor={group.legend_color_hex}
                    className="h-full w-full"
                    resolvedLayerIds={resolvedLayerIds}
                    onLayerCreated={handleLayerCreated}
                    onLayerDeleted={(id) => { void handleItemDelete(id) }}
                    onLayerEdited={handleLayerEdited}
                  />
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <InfrastructureFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null) }}
        groupId={group.id}
        item={editingItem}
        onSuccess={handleFormSuccess}
      />
    </AppLayout>
  )
}