import AssistanceTab from '@/components/household/detail/assistance-tab';
import DetailHeader from '@/components/household/detail/detail-header';
import GeneralInfoTab from '@/components/household/detail/general-info-tab';
import PhotoGallery from '@/components/household/detail/photo-gallery';
import TechnicalDataTab from '@/components/household/detail/technical-data-tab';
import HouseholdMapTab from '@/components/household/map-tab';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HouseholdDetail } from '@/types/household';
import { getPhotoUrl } from '@/utils/household-formatters';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteHouseholdDialog from '@/components/household/households-list/delete-household-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Detail Rumah', href: '/households/{id}' },
];

interface Props {
    household: HouseholdDetail;
}

export default function HouseholdDetail({ household }: Props) {
    // Read returnTo from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    const backUrl =
        returnTo === 'preview' ? '/households/preview' : '/households';
    const backLabel = returnTo === 'preview' ? 'Preview Import' : 'Data Rumah';
    const [householdToDelete, setHouseholdToDelete] = useState<number | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const isThisHouseholdSelected = householdToDelete === household.id;

    const photos = Array.isArray(
        (household as unknown as Record<string, unknown>).photos,
    )
        ? ((household as unknown as Record<string, unknown>)
              .photos as unknown[])
        : [];

    // Check if there are any valid photos with URLs
    const hasValidPhotos = photos.some((p) => getPhotoUrl(p) !== null);

    const handleDeleteClick = (id: number) => {
        setHouseholdToDelete(id);
    }

    const handleDeleteConfirm = () => {
        if (!householdToDelete) return;

        setIsDeleting(true);
        try {
            router.delete(`/households/${householdToDelete}`, {
                preserveState: true,
                preserveScroll: true,
            });
            setHouseholdToDelete(null);
        } catch (error) {
            console.error('Error deleting household:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    const handleDeleteCancel = () => {
        setHouseholdToDelete(null);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rumah ${household.head_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 bg-background p-6">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.visit(backUrl)}
                        className="mb-4 w-fit gap-2 text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            onClick={() => router.visit(`/households/${household.id}/edit`)}
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                        <DeleteHouseholdDialog
                            householdId={household.id}
                            isDeleting={isDeleting}
                            onDelete={handleDeleteConfirm}
                            onCancel={handleDeleteCancel}
                            open={isThisHouseholdSelected}
                            onOpenChange={(open) => {
                                if (!open) {
                                    handleDeleteCancel();
                                }
                            }}
                            trigger={
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteClick(household.id)}
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            }
                        />
                    </div>
                </div>

                {/* Detail Card with Gallery + Tabs */}
                <Card className="overflow-hidden border-border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Gallery (left) - only render if there are valid photos */}
                            {hasValidPhotos && (
                                <div className="lg:w-2/5">
                                    <PhotoGallery
                                        photos={photos}
                                        alt={household.head_name}
                                    />
                                </div>
                            )}

                            {/* Right side: Heading + Tabs - full width if no photos */}
                            <div
                                className={
                                    hasValidPhotos ? 'lg:w-3/5' : 'w-full'
                                }
                            >
                                <DetailHeader
                                    headName={household.head_name}
                                    addressText={household.address_text}
                                />
                                <Tabs defaultValue="umum" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4 bg-muted">
                                        <TabsTrigger value="umum">
                                            Umum
                                        </TabsTrigger>
                                        <TabsTrigger value="teknis">
                                            Data Teknis
                                        </TabsTrigger>
                                        <TabsTrigger value="lokasi">
                                            Lokasi Peta
                                        </TabsTrigger>
                                        <TabsTrigger value="bantuan">
                                            Bantuan
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab: Umum */}
                                    <TabsContent value="umum">
                                        <GeneralInfoTab household={household} />
                                    </TabsContent>

                                    {/* Tab: Data Teknis */}
                                    <TabsContent value="teknis">
                                        <TechnicalDataTab
                                            household={household}
                                        />
                                    </TabsContent>

                                    {/* Tab: Lokasi Peta */}
                                    <TabsContent
                                        value="lokasi"
                                        className="mt-6"
                                    >
                                        <HouseholdMapTab
                                            household={household}
                                        />
                                    </TabsContent>

                                    {/* Tab: Bantuan */}
                                    <TabsContent value="bantuan">
                                        <AssistanceTab household={household} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
