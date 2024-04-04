"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

export interface ISelectSearchOption {
    options: {
        label: string
        value: string
    }[]
    initValue?: any
    placeholder?: string
    onChange?: (value: string) => void
    buttonClassName?: string
    ButtonIcon?: React.ReactNode
    active?: boolean
}

export default function SelectSearch({
    options,
    placeholder,
    initValue,
    onChange,
    buttonClassName,
    ButtonIcon,
    active
}: ISelectSearchOption) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(initValue ?? "")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full flex justify-between overflow-hidden gap-2", buttonClassName)}
                    >
                        <span className={cn(active ? "text-primary" : "")}>
                            {ButtonIcon}
                        </span>
                        <span className={cn("max-w-40 overflow-hidden text-ellipsis")}>
                            {value
                                ? options.find((option) => option.value.toLocaleLowerCase() === value.toLocaleLowerCase())?.label
                                : (placeholder ?? "Selecciona una opción...")}
                        </span>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 pb-2">
                <Command>
                    <CommandInput placeholder={placeholder ?? "Selecciona una opción..."} className="h-9" />
                    <CommandEmpty>Sin resultados</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto text-ellipsis">
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                    onChange?.(option.label)
                                }}
                            >
                                {option.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4 text-primary",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}