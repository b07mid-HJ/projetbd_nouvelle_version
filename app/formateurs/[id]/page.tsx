import { getFormateurById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface FormateurDetailPageProps {
  params: {
    id: string
  }
}

export default async function FormateurDetailPage({ params }: FormateurDetailPageProps) {
  const formateur = await getFormateurById(params.id)

  if (!formateur) {
    notFound()
  }

  // Prepare display values with fallbacks for API format
  const displayName = formateur.name || `${formateur.prenom || ''} ${formateur.nom || ''}`
  const displayEmail = formateur.email || ''
  const displayPhone = formateur.phone || formateur.tel || ''
  const displayType = formateur.type || 'N/A'
  const displayEmployeur = formateur.employeur?.nomemployeur || 'N/A'
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/formateurs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
        </div>
        <Button asChild>
          <Link href={`/formateurs/${formateur.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Formateur
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formateur Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">First Name</div>
              <div>{formateur.firstName || formateur.prenom || 'N/A'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Last Name</div>
              <div>{formateur.lastName || formateur.nom || 'N/A'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{displayEmail}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div>{displayPhone}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Type</div>
              <div>{displayType}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Employeur</div>
              <div>{displayEmployeur}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
