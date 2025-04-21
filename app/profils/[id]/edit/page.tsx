import { getProfilById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProfilForm } from "../../profil-form"

interface EditProfilPageProps {
  params: {
    id: string
  }
}

export default async function EditProfilPage({ params }: EditProfilPageProps) {
  const profil = await getProfilById(params.id)

  if (!profil) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/profils/${profil.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profil</h1>
      </div>

      <ProfilForm profil={profil} />
    </div>
  )
}
