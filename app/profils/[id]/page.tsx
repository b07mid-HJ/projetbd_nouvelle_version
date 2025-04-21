import { getProfilById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface ProfilDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProfilDetailPage({ params }: ProfilDetailPageProps) {
  const profil = await getProfilById(params.id)

  if (!profil) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/profils">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{profil.libelle}</h1>
        </div>
        <Button asChild>
          <Link href={`/profils/${profil.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profil
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Libelle</div>
            <div>{profil.libelle}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
