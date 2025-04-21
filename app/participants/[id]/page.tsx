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
          <h1 className="text-3xl font-bold tracking-tight">{participant.name}</h1>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Participant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{participant.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{participant.email}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{participant.phone}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div>
                  <Badge
                    variant={
                      participant.status === "active"
                        ? "default"
                        : participant.status === "completed"
                          ? "success"
                          : "secondary"
                    }
                  >
                    {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Enrollment Date</div>
              <div>{new Date(participant.enrollmentDate).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training History</CardTitle>
          </CardHeader>
          <CardContent>
            {participant.trainingHistory.length > 0 ? (
              <div className="space-y-4">
                {participant.trainingHistory.map((training, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{training.program}</div>
                      <Badge
                        variant={
                          training.status === "ongoing"
                            ? "default"
                            : training.status === "completed"
                              ? "success"
                              : "destructive"
                        }
                      >
                        {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div>Started: {new Date(training.startDate).toLocaleDateString()}</div>
                      {training.endDate && <div>Completed: {new Date(training.endDate).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No training history available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
