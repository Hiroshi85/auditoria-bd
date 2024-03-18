"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { CaretDownIcon, ExitIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Close } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { Session, User } from "next-auth"

export default function UserButton({
  user
}: {
  user: User
}) {
  // const {data} = useSession()
  return (
    <Dialog>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2">
            <Image
              src={"/avatar.png"}
              alt="User"
              width={80}
              height={80}
              className="rounded-full w-10 h-10 object-cover"
            />
            <CaretDownIcon className="w-4 h-4" />
          </button>

        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="flex flex-col gap-2">
            <span>
              {user?.name}
            </span>
            <span className="text-sm font-normal leading-none">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <span>
                    <ExitIcon className="w-4 h-4 mr-2" />
                  </span>
                  <span>
                  Cerrar sesión
                  </span>
              </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog/>
    </Dialog>
  )
}

function ConfirmDialog() {
  const [loading, setLoading] = useState(false);

  return <DialogContent>
      <DialogHeader>
          <DialogTitle>Cerrar sesión</DialogTitle>
      </DialogHeader>
      <div>
          <p>¿Está seguro que quiere cerrar sesión?</p>
      </div>
      <DialogFooter className="">
          <Close className={buttonVariants()}>
              Cancelar
          </Close>
          <Button  variant={"outline"} 
              disabled={loading}
              className="min-w-[100px]"
              onClick={
                  async () => {
                    setLoading(true)
                    try{
                      const response = await signOut();
                    }catch(e){
                      setLoading(false)
                      toast.error("Ha ocurrido un error :(",{
                        position: "top-center",
                      })
                    }
                  }
              }>
              {
                loading ? (
                    // <PuffLoader size={20}/>
                    <span>
                        Cargando...	
                    </span>
                ) : (
                    <span>
                        Cerrar sesión
                    </span>
                )
              }
          </Button>
      </DialogFooter>
  </DialogContent>
}