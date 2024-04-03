"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

type Props = {
    options: {
        label: string
        value: string
        id?: number
    }[]

    onSelect: (value: string, id?: number) => void
    isDisabled?: boolean
}

export function Combobox(
    { options, onSelect, isDisabled }: Props
) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <Popover
            open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={isDisabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : "Select option..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0"
            >
                <Command>
                    <CommandInput placeholder="Search option..." />
                    <CommandEmpty>Opción no encontrada</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue: string) => {
                                    onSelect(currentValue == value ? "" : currentValue, option.id)
                                    setValue(currentValue == value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
