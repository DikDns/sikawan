import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

function formatDate(date: Date | undefined) {
    if (!date) {
        return '';
    }

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

interface DatePickerProps {
    value?: Date | undefined;
    onDateChange?: (date: Date | undefined) => void;
    placeholder?: string;
}

export function DatePicker({
    value,
    onDateChange,
    placeholder = 'Pilih Tanggal Pendataan',
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(formatDate(value));
    const [month, setMonth] = React.useState<Date | undefined>(
        value || new Date(),
    );

    // Sync input value when prop value changes
    React.useEffect(() => {
        setInputValue(formatDate(value));
        if (value) {
            setMonth(value);
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        setInputValue(inputVal);
        const parsedDate = new Date(inputVal);
        if (isValidDate(parsedDate)) {
            onDateChange?.(parsedDate);
            setMonth(parsedDate);
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        onDateChange?.(date);
        setInputValue(formatDate(date));
        setOpen(false);
    };

    return (
        <div className="relative flex gap-2">
            <Input
                id="date"
                value={inputValue}
                placeholder={placeholder}
                className="bg-background pr-10"
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Pilih Tanggal Pendataan</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={handleCalendarSelect}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
