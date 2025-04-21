import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getEmployeurs } from "@/lib/actions"
import { EmployeurTable } from "./employeur-table"

export default async function EmployeursPage() {
  const employeurs = await getEmployeurs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employeurs</h1>
          <p className="text-muted-foreground">Manage trainer employers</p>
        </div>
        <Button asChild>
          <Link href="/employeurs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employeur
          </Link>
        </Button>
      </div>

      <EmployeurTable employeurs={employeurs} />
    </div>
  )
}
