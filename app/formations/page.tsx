import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getFormations } from "@/lib/actions"
import { FormationTable } from "./formation-table"

export default async function FormationsPage() {
  const formations = await getFormations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
          <p className="text-muted-foreground">Manage training programs</p>
        </div>
        <Button asChild>
          <Link href="/formations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trainings
          </Link>
        </Button>
      </div>

      <FormationTable formations={formations} />
    </div>
  )
}
