import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getStructures } from "@/lib/actions"
import { StructureTable } from "./structure-table"

export default async function StructuresPage() {
  const structures = await getStructures()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Structurs</h1>
          <p className="text-muted-foreground">Manage organizational structures</p>
        </div>
        <Button asChild>
          <Link href="/structures/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Structure
          </Link>
        </Button>
      </div>

      <StructureTable structures={structures} />
    </div>
  )
}
