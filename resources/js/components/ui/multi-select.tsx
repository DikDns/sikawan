"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MultiSelect({
    options,
    value = [],
    onChange,
    placeholder = "Select options...",
    searchPlaceholder = "Search..."
}: {
    options: { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
}) {
    const [open, setOpen] = useState(false);

    const toggleOption = (v: string) => {
        if (value.includes(v)) {
            onChange(value.filter((x) => x !== v));
        } else {
            onChange([...value, v]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "w-full min-h-[38px] border rounded px-3 py-2 flex items-center justify-between bg-white text-sm",
                        value.length === 0 && "text-muted-foreground"
                    )}
                >
                    <div className="flex gap-1 flex-wrap text-left">
                        {value.length === 0 ? (
                            placeholder
                        ) : (
                            value.map((v) => {
                                const item = options.find((o) => o.value === v);
                                if (!item) return null;
                                return (
                                    <Badge key={v} variant="secondary" className="flex items-center gap-1">
                                        {item.label}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOption(v);
                                            }}
                                        />
                                    </Badge>
                                );
                            })
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandList className="max-h-52 overflow-auto">
                        {options.map((opt) => {
                            const selected = value.includes(opt.value);
                            return (
                                <CommandItem
                                    key={opt.value}
                                    onSelect={() => toggleOption(opt.value)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "h-4 w-4 rounded-sm border flex items-center justify-center",
                                            selected ? "bg-primary text-primary-foreground" : "bg-white"
                                        )}
                                    >
                                        {selected && <Check className="h-3 w-3" />}
                                    </div>
                                    {opt.label}
                                </CommandItem>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
