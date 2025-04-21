import { getFormationById, getDomaineById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface FormationDetailPageProps {
  params: {
    id: string
  }
}

export default async function FormationDetailPage({ params }: FormationDetailPageProps) {
  const formation = await getFormationById(params.id)

  if (!formation) {
    notFound()
  }

  const domaine = await getDomaineById(formation.domaineId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/formations">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{formation.titre}</h1>
        </div>
        <Button asChild>
          <Link href={`/formations/${formation.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Formation
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Titre</div>
              <div>{formation.titre}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Année</div>
              <div>{formation.annee}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Durée (jours)</div>
              <div>{formation.duree}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Domaine</div>
              <div>{domaine?.libelle || "Unknown"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Budget</div>
              <div>
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(formation.budget)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
