import { getFormateurById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormateurForm } from "../../formateur-form"

interface EditFormateurPageProps {
  params: {
    id: string
  }
}

export default async function EditFormateurPage({ params }: EditFormateurPageProps) {
  const formateur = await getFormateurById(params.id)

  if (!formateur) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/formateurs/${formateur.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Formateur</h1>
      </div>

      <FormateurForm formateur={formateur} />
    </div>
  )
}
