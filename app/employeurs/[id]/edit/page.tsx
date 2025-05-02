import { getEmployeurById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EmployeurForm } from "../../employeur-form"

interface EditEmployeurPageProps {
  params: {
    id: string
  }
}

export default async function EditEmployeurPage({ params }: EditEmployeurPageProps) {
  const employeur = await getEmployeurById(params.id)

  if (!employeur) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/employeurs/${employeur.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Employer</h1>
      </div>

      <EmployeurForm employeur={employeur} />
    </div>
  )
}
