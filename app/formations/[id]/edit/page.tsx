import { getFormationById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormationForm } from "../../formation-form"

interface EditFormationPageProps {
  params: {
    id: string
  }
}

export default async function EditFormationPage({ params }: EditFormationPageProps) {
  const formation = await getFormationById(params.id)

  if (!formation) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/formations/${formation.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Formation</h1>
      </div>

      <FormationForm formation={formation} />
    </div>
  )
}
