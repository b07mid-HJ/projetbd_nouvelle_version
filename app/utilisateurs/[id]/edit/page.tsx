import { getUtilisateurById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UtilisateurForm } from "../../utilisateur-form"

interface EditUtilisateurPageProps {
  params: {
    id: string
  }
}

export default async function EditUtilisateurPage({ params }: EditUtilisateurPageProps) {
  const utilisateur = await getUtilisateurById(params.id)
  
  // Ensure we have the correct format for the form
  if (utilisateur && utilisateur.role && typeof utilisateur.role === 'object') {
    // Add roleId property for compatibility with the form
    utilisateur.roleId = utilisateur.role.id
  }

  if (!utilisateur) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/utilisateurs/${utilisateur.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      </div>

      <UtilisateurForm utilisateur={utilisateur} />
    </div>
  )
}
