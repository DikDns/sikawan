import * as React from 'react';
import { CheckIcon, ChevronDownIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export interface SelectOption {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    clearable?: boolean;
    className?: string;
    disabled?: boolean;
}

export const SearchableSelect = React.forwardRef<
    HTMLButtonElement,
    SearchableSelectProps
>(
    (
        {
            options,
            value = '',
            onValueChange,
            placeholder = 'Pilih...',
            searchPlaceholder = 'Cari...',
            emptyMessage = 'Tidak ada hasil ditemukan.',
            clearable = true,
            className,
            disabled = false,
            ...props
        },
        ref,
    ) => {
        const [open, setOpen] = React.useState(false);
        const selectedOption = React.useMemo(() => {
            const found = options.find((opt) => String(opt.value) === String(value));
            return found;
        }, [options, value]);

        const handleSelect = React.useCallback(
            (selectedValue: string) => {
                // cmdk passes the formatted value from CommandItem's value prop
                // We set it as "value label", so we need to extract the actual value

                // Strategy 1: Direct match by value (with string conversion)
                let option = options.find(
                    (opt) => String(opt.value) === String(selectedValue),
                );

                // Strategy 2: Match by full formatted string "value label"
                if (!option) {
                    option = options.find(
                        (opt) => `${opt.value} ${opt.label}` === selectedValue,
                    );
                }

                // Strategy 3: Extract value from formatted string (first part before space)
                if (!option && selectedValue.includes(' ')) {
                    // Try to find by checking if any option's "value label" format matches
                    option = options.find(
                        (opt) => selectedValue === `${opt.value} ${opt.label}`,
                    );

                    // If still not found, extract the first word as potential value
                    if (!option) {
                        const parts = selectedValue.split(' ');
                        const potentialValue = parts[0];
                        option = options.find(
                            (opt) => String(opt.value) === String(potentialValue),
                        );
                    }
                }

                if (option) {
                    // Ensure value is always a string
                    const valueToSend = String(option.value);
                    onValueChange?.(valueToSend);
                    setOpen(false);
                } else {
                    console.warn('No matching option found for:', selectedValue);
                }
            },
            [options, onValueChange],
        );

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            onValueChange?.('');
            setOpen(false);
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        ref={ref}
                        variant="outline"
                        type="button"
                        disabled={disabled}
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        className={cn(
                            'flex h-10 w-full items-center justify-between px-3 py-2 text-left font-normal',
                            !value && 'text-muted-foreground',
                            disabled && 'cursor-not-allowed opacity-50',
                            !disabled && 'cursor-pointer',
                            className,
                        )}
                        {...props}
                    >
                        <span className="flex-1 truncate">
                            {selectedOption ? (
                                selectedOption.label
                            ) : (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                        </span>
                        <div className="flex items-center gap-1">
                            {value && clearable && !disabled && (
                                <>
                                    <X
                                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClear(e);
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    />
                                    <Separator
                                        orientation="vertical"
                                        className="h-4"
                                    />
                                </>
                            )}
                            <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = String(value) === String(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={`${option.value} ${option.label}`}
                                            onSelect={(val) => {
                                                handleSelect(val);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 items-center justify-center',
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'invisible',
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

SearchableSelect.displayName = 'SearchableSelect';
