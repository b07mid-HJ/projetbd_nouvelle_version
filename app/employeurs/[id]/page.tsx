import { getEmployeurById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface EmployeurDetailPageProps {
  params: {
    id: string
  }
}

export default async function EmployeurDetailPage({ params }: EmployeurDetailPageProps) {
  const employeur = await getEmployeurById(params.id)

  if (!employeur) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employeurs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{employeur.nomemployeur}</h1>
        </div>
        <Button asChild>
          <Link href={`/employeurs/${employeur.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Employeur
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employeur Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Nom Employeur</div>
            <div>{employeur.nomemployeur}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
