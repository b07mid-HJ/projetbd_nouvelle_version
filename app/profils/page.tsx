import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getProfils } from "@/lib/actions"
import { ProfilTable } from "./profil-table"

export default async function ProfilsPage() {
  const profils = await getProfils()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profils</h1>
          <p className="text-muted-foreground">Manage participant profiles</p>
        </div>
        <Button asChild>
          <Link href="/profils/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Profil
          </Link>
        </Button>
      </div>

      <ProfilTable profils={profils} />
    </div>
  )
}
