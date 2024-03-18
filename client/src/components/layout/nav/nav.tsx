import { User, getServerSession } from "next-auth"
import UserButton from "./user-button"
import Image from "next/image"
import { authOptions } from "@/server/auth-options"

export default async function Nav() {
  const session = await getServerSession(authOptions)
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container py-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl">SISTEMA AUDITORIA</h1>
          </div>

          <div>
            <UserButton user={session?.user as User} />
          </div>
        </div>
      </nav>
    </div>
  )
}