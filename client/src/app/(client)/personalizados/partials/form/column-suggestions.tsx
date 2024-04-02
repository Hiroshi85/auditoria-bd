"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Column } from "@/types/database";
import { LucidePanelBottomOpen } from "lucide-react";
import { PersonalizadasFormSchema } from "./form-schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos";

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
      <PopoverContent className="w-[450px]" align="start" side="top">
        <ToggleGroup
          type="single"
          variant={"outline"}
          className="flex flex-wrap gap-x-2 gap-y-4 justify-start items-start max-h-[200px] overflow-y-scroll pt-2"
          style={{ scrollbarWidth: "thin" }}
          onValueChange={(value) => {
            form.setValue("query", form.getValues("query") + value);
            setColumnsListOpen(false);
          }}
        >
          {columns?.map((column) => (
            <ToggleGroupItem
              key={column.name}
              value={column.name}
              aria-label={`Toggle ${column.name}`}
              className="relative min-w-[80px] overflow-visible"
            >
              {column.name}
              <Badge className="absolute right-[-7px] top-[-9px] text-[0.55rem] py-0 h-[15px]">
                {obtenerTipoDatoSQL(column.type)?.name ?? ""}
              </Badge>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}
