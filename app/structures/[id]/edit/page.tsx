import { getStructureById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { StructureForm } from "../../structure-form"

interface EditStructurePageProps {
  params: {
    id: string
  }
}

export default async function EditStructurePage({ params }: EditStructurePageProps) {
  const structure = await getStructureById(params.id)

  if (!structure) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/structures/${structure.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Structure</h1>
      </div>

      <StructureForm structure={structure} />
    </div>
  )
}
