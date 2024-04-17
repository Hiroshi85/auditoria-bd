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
        <CommandList style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable'}}>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup>
            {query.data?.map((query) => {
              return (
                <CommandItem
                  key={query.id}
                  value={query.name}
                  aria-label={`Toggle ${query.id}`}
                  className="flex justify-between items-center cursor-pointer max-w-[400px] p-0 my-2"
                >
                  <Button
                    type="button"
                    role="option"
                    className="grow break-words text-wrap w-full text-start text-xs "
                    variant={"ghost"}
                    onClick={() => {
                      form.clearErrors();
                      setSelectedQuery(query);
                      form.setValue("query", query.query);
                      form.setValue("name", query.name);
                    }}
                  >
                    {query.name}
                  </Button>
                  <div className="relative flex flex-col justify-center items-center">
                    {selectedQuery?.id === query.id && (
                      <Button
                        type="button"
                        variant={"link"}
                        className="p-0 absolute -bottom-2 -right-0 text-red-500 z-10"
                        onClick={() => setSelectedQuery(null)}
                      >
                        <XCircle size={18} />
                      </Button>
                    )}
                    <DialogTrigger
                      className="absolute top-auto -right-6 z-10"
                      onClick={() => setSelectedQuery(query)}
                    >
                      <Trash size={18} />
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
                form.reset();
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
