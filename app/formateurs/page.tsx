import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getFormateurs } from "@/lib/actions"
import { FormateurTable } from "./formateur-table"

export default async function FormateursPage() {
  const formateurs = await getFormateurs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground">Manage trainer profiles and information</p>
        </div>
        <Button asChild>
          <Link href="/formateurs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trainer
          </Link>
        </Button>
      </div>

      <FormateurTable formateurs={formateurs} />
    </div>
  )
}
