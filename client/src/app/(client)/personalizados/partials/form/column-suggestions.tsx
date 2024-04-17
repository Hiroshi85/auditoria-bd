"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Column } from "@/types/database";
import { LucidePanelBottomOpen } from "lucide-react";
import { PersonalizadasFormSchema } from "./form-schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  form: UseFormReturn<z.infer<typeof PersonalizadasFormSchema>>;
  columns: Column[] | undefined;
}

export default function ColumnSuggestions({ form, columns }: Props) {
  const [columnsListOpen, setColumnsListOpen] = useState(false);

  return (
    <Popover open={columnsListOpen} onOpenChange={setColumnsListOpen}>
      <PopoverTrigger className="bg-accent rounded-md">
        <LucidePanelBottomOpen />
      </PopoverTrigger>
      <PopoverContent className="w-[450px] h-[300px]" align="start" side="top">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup heading="Columnas">
              {columns?.map((column) => {
                return (
                  <CommandItem
                    key={column.name}
                    value={column.name}
                    aria-label={`Toggle ${column.name}`}
                    className="p-0"
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full h-full p-2"
                      onClick={() => {
                        form.setValue(
                          "query",
                          form.getValues("query") + column.name
                        );
                        setColumnsListOpen(false);
                      }}
                    >
                      <span>{column.name}</span>
                      <Badge className="text-[0.55rem] py-0 h-[15px]">
                        {obtenerTipoDatoSQL(column.type)?.name ?? ""}
                      </Badge>
                    </button>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
