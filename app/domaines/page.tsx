import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getDomaines } from "@/lib/actions"
import { DomaineTable } from "./domaine-table"

export default async function DomainesPage() {
  const domaines = await getDomaines()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domaines</h1>
          <p className="text-muted-foreground">Manage training domains</p>
        </div>
        <Button asChild>
          <Link href="/domaines/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Domaine
          </Link>
        </Button>
      </div>

      <DomaineTable domaines={domaines} />
    </div>
  )
}
