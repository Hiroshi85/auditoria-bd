"use client"
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

interface Props {
  form: UseFormReturn<z.infer<typeof PersonalizadasFormSchema>>;
  columns: Column[] | undefined;
}

export default function ColumnSuggestions({
  form, columns
}: Props) {
  const [columnsListOpen, setColumnsListOpen] = useState(false);
  return (
    <Popover open={columnsListOpen} onOpenChange={setColumnsListOpen}>
      <PopoverTrigger className="bg-accent rounded-md">
        <LucidePanelBottomOpen />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="start" side="top">
        <ToggleGroup
          type="single"
          variant={"outline"}
          className="flex flex-wrap gap-1.5 justify-start items-start h-[200px] overflow-y-scroll"
          style={{ scrollbarWidth: "thin" }}
          onValueChange={(value) => {
            form.setValue("columns", form.getValues("columns") + value);
            setColumnsListOpen(false);
          }}
        >
          {columns?.map((column) => (
            <ToggleGroupItem
              key={column.name}
              value={column.name}
              aria-label={`Toggle ${column.name}`}
            >
              {column.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}
