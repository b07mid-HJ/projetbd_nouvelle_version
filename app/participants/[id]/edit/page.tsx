import { getParticipantById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ParticipantForm } from "../../participant-form"

interface EditParticipantPageProps {
  params: {
    id: string
  }
}

export default async function EditParticipantPage({ params }: EditParticipantPageProps) {
  const participant = await getParticipantById(params.id)

  if (!participant) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/participants/${participant.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Participant</h1>
      </div>

      <ParticipantForm participant={participant} />
    </div>
  )
}
