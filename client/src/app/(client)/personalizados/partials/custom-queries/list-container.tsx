"use client";
import { API_HOST } from "@/constants/server";
import { CustomQueriesResponse } from "@/types/excepciones/personalizadas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash, XCircle } from "lucide-react";
import { usePersonalizadas } from "../../personalizados.context";
import { useState } from "react";

export default function CustomQueries() {
  const [openDialog, setOpenDialog] = useState(false);
  const { form, connection, selectedQuery, deleteQuery, setSelectedQuery } =
    usePersonalizadas();

  const query = useQuery({
    queryKey: ["custom-queries"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_HOST}/exceptions/db/${connection.id}/custom/queries/get`,
        { withCredentials: true }
      );

      return response.data as CustomQueriesResponse[];
    },
  });

  if (query.isLoading) {
    return <></>;
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Command>
        <CommandInput placeholder="Buscar consultas personalizadas" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup>
            {query.data?.map((query) => {
              return (
                <CommandItem
                  key={query.id}
                  value={query.name}
                  aria-label={`Toggle ${query.id}`}
                  onClickCapture={() => {
                    form.clearErrors();
                    setSelectedQuery(query);
                    form.setValue("query", query.query);
                    form.setValue("name", query.name);
                  }}
                  className="flex grow justify-between items-center cursor-pointer min-h-[52px] max-w-[400px]"
                >
                  <p className="grow break-words text-wrap max-w-[350px]">
                    {query.name}
                  </p>
                  <div className="relative flex flex-col justify-center items-center">
                    {selectedQuery?.id === query.id && (
                      <Button
                        type="button"
                        variant={"link"}
                        className="p-0 absolute -bottom-2 -right-8 text-red-500 z-10"
                        onClick={() => setSelectedQuery(null)}
                      >
                        <XCircle size={20} />
                      </Button>
                    )}
                    <DialogTrigger className="absolute top-0 -right-8 z-10">
                      <Trash size={20} />
                    </DialogTrigger>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>¿Seguro que quiere eliminar este registro?</DialogTitle>
          <DialogDescription>
            Consulta de excepciones personalizada
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-x-2">
          <div className="grid flex-1 gap-2">{selectedQuery?.name}</div>
          <div className="w-full p-2 bg-accent rounded-md font-mono">
            {selectedQuery?.query}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            variant="destructive"
            onClick={() => {
              if (selectedQuery) {
                deleteQuery.mutate(selectedQuery?.id);
                setSelectedQuery(null);
                setOpenDialog(false);
              }
            }}
          >
            Eliminar
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedQuery(null)}
            >
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
