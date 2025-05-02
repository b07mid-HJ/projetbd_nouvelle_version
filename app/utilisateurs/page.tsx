import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getUtilisateurs } from "@/lib/actions"
import { UtilisateurTable } from "./utilisateur-table"

export default async function UtilisateursPage() {
  const utilisateurs = await getUtilisateurs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage system users and access rights</p>
        </div>
        <Button asChild>
          <Link href="/utilisateurs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <UtilisateurTable utilisateurs={utilisateurs} />
    </div>
  )
}
