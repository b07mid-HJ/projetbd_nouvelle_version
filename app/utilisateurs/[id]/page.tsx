import { getUtilisateurById, getRoleById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface UtilisateurDetailPageProps {
  params: {
    id: string
  }
}

export default async function UtilisateurDetailPage({ params }: UtilisateurDetailPageProps) {
  const utilisateur = await getUtilisateurById(params.id)

  if (!utilisateur) {
    notFound()
  }

  const role = await getRoleById(utilisateur.roleId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/utilisateurs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{utilisateur.login}</h1>
        </div>
        <Button asChild>
          <Link href={`/utilisateurs/${utilisateur.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Utilisateur
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateur Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Login</div>
              <div>{utilisateur.login}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div>{role?.name || "Unknown"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
