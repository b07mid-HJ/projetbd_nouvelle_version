import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getParticipants } from "@/lib/actions"
import { ParticipantTable } from "./participant-table"

export default async function ParticipantsPage() {
  const participants = await getParticipants()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">Manage trainee profiles and enrollment information</p>
        </div>
        <Button asChild>
          <Link href="/participants/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Participant
          </Link>
        </Button>
      </div>

      <ParticipantTable participants={participants} />
    </div>
  )
}
