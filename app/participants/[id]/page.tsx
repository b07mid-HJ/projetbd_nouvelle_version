import { getParticipantById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ParticipantDetailPageProps {
  params: {
    id: string
  }
}

export default async function ParticipantDetailPage({ params }: ParticipantDetailPageProps) {
  const participant = await getParticipantById(params.id)

  if (!participant) {
    notFound()
  }

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/participants">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{participant.nom+" "+participant.prenom}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/participants/${participant.id}/add-training`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Training
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/participants/${participant.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Participant
            </Link>
          </Button>
        </div>
      </div>

        <Card>
          <CardHeader>
            <CardTitle>Participant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{participant.nom +" "+ participant.prenom}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{participant.email}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{participant.tel}</div>
              </div>
              {/* add strucuture and profil  */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Structure</div>
                <div>{participant.structure.libelle}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Profil</div>
                <div>{participant.profil.libelle}</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
  )
}
