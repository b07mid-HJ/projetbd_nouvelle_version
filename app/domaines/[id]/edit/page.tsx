import { getDomaineById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DomaineForm } from "../../domaine-form"

interface EditDomainePageProps {
  params: {
    id: string
  }
}

export default async function EditDomainePage({ params }: EditDomainePageProps) {
  const domaine = await getDomaineById(params.id)

  if (!domaine) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/domaines/${domaine.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Domain</h1>
      </div>

      <DomaineForm domaine={domaine} />
    </div>
  )
}
