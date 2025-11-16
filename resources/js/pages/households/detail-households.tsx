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
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Detail Rumah', href: '/households/{id}' },
];

interface Props {
    household: HouseholdDetail;
}

export default function HouseholdDetail({ household }: Props) {
    const photos = Array.isArray(
        (household as unknown as Record<string, unknown>).photos,
    )
        ? ((household as unknown as Record<string, unknown>)
              .photos as unknown[])
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rumah ${household.head_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 bg-background p-6">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => router.visit('/households')}
                    className="mb-4 w-fit gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Data Rumah
                </Button>

                {/* Detail Card with Gallery + Tabs */}
                <Card className="overflow-hidden border-border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Gallery (left) */}
                            <div className="lg:w-2/5">
                                <PhotoGallery
                                    photos={photos}
                                    alt={household.head_name}
                                />
                            </div>

                            {/* Right side: Heading + Tabs */}
                            <div className="lg:w-3/5">
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
