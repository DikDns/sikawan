import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface Step {
    id: string;
    title: string;
    number: number;
}

interface MultiStepFormProps {
    title: string;
    steps: Step[];
    currentStep: number;
    onClose: () => void;
    children: ReactNode;
    onNext?: () => void;
    onPrevious?: () => void;
    canGoNext?: boolean;
    canGoPrevious?: boolean;
    isLoading?: boolean;
}

export default function MultiStepForm({
    title,
    steps,
    currentStep,
    onClose,
    children,
    onNext,
    onPrevious,
    canGoNext = true,
    canGoPrevious = true,
    isLoading = false,
}: MultiStepFormProps) {
    const currentStepIndex = currentStep - 1;

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <Card className="mx-auto max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">{title}</h1>
                    </div>
                </CardHeader>

                {/* Step Indicator */}
                <CardContent className="border-b py-6">
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="flex flex-1 items-center"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                                            index === currentStepIndex
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : index < currentStepIndex
                                                  ? 'border-primary bg-primary/10 text-primary'
                                                  : 'border-muted-foreground/30 bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {step.number}
                                    </div>
                                    <span
                                        className={cn(
                                            'hidden text-xs font-medium md:block',
                                            index === currentStepIndex
                                                ? 'text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            'h-0.5 flex-1 border-t-2 border-dashed transition-colors',
                                            index < currentStepIndex
                                                ? 'border-primary'
                                                : 'border-muted-foreground/30',
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>

                {/* Form Content */}
                <CardContent className="py-6">{children}</CardContent>

                {/* Navigation Buttons */}
                <CardContent className="flex items-center justify-between border-t pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrevious}
                        disabled={
                            !canGoPrevious || currentStep === 1 || isLoading
                        }
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!canGoNext || isLoading}
                        className="bg-[#A7F300] text-black hover:bg-[#A7F300]/90"
                    >
                        {isLoading ? 'Menyimpan...' : 'Lanjutkan'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
