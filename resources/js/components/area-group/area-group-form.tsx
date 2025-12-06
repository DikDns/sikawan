import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useMemo } from 'react';

export type AreaGroup = {
    id?: number;
    code: string;
    name: string;
    description?: string | null;
    legend_color_hex: string;
    legend_icon?: string | null;
};

type Mode = 'create' | 'edit';

interface Props {
    mode: Mode;
    initial?: AreaGroup;
}

const defaults: AreaGroup = {
    code: '',
    name: '',
    description: '',
    legend_color_hex: '#8B5CF6', // default to violet-500
    legend_icon: '',
};

export const AreaGroupForm = ({ mode, initial }: Props) => {
    const starting = useMemo(
        () => ({ ...defaults, ...(initial ?? {}) }),
        [initial],
    );

    const { data, setData, post, put, processing, errors, reset } =
        useForm<AreaGroup>(starting);

    // Ensure form data syncs when `initial` props arrive or change
    useEffect(() => {
        setData(starting);
    }, [starting]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (mode === 'create') {
                post('/areas', {
                    onSuccess: () => {
                        reset();
                    },
                });
            } else if (mode === 'edit' && initial?.id) {
                put(`/areas/${initial.id}`);
            }
        },
        [mode, post, put, initial?.id, reset],
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <Field>
                        <FieldLabel htmlFor="code">Kode Kawasan</FieldLabel>
                        <FieldContent>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                                placeholder="Mis. SLUM"
                                aria-label="Kode Kawasan"
                            />
                            <FieldError
                                errors={
                                    errors.code
                                        ? [{ message: errors.code }]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="name">Nama Kawasan</FieldLabel>
                        <FieldContent>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Nama kawasan"
                                aria-label="Nama Kawasan"
                            />
                            <FieldError
                                errors={
                                    errors.name
                                        ? [{ message: errors.name }]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="legend_color_hex">
                            Warna Legend (Hex)
                        </FieldLabel>
                        <FieldContent>
                            <Input
                                id="legend_color_hex"
                                value={data.legend_color_hex}
                                onChange={(e) =>
                                    setData('legend_color_hex', e.target.value)
                                }
                                type="color"
                                placeholder="#RRGGBB"
                                aria-label="Warna Legend"
                            />
                            <div className="flex items-center gap-2 pt-1">
                                <div
                                    className="h-6 w-6 rounded border"
                                    aria-label="Preview warna"
                                    style={{
                                        backgroundColor: data.legend_color_hex,
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Preview
                                </span>
                            </div>
                            <FieldError
                                errors={
                                    errors.legend_color_hex
                                        ? [{ message: errors.legend_color_hex }]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                        <FieldContent>
                            <Textarea
                                id="description"
                                value={data.description ?? ''}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Deskripsi kawasan"
                                aria-label="Deskripsi Kawasan"
                                className="min-h-24"
                            />
                            <FieldError
                                errors={
                                    errors.description
                                        ? [{ message: errors.description }]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => history.back()}
                >
                    Batal
                </Button>
                <Button type="submit" disabled={processing}>
                    {mode === 'create' ? 'Simpan' : 'Perbarui'}
                </Button>
            </div>
        </form>
    );
};

export default AreaGroupForm;
