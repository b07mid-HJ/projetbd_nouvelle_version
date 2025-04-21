import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getRoles } from "@/lib/actions"
import { RoleTable } from "./role-table"

export default async function RolesPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button asChild>
          <Link href="/roles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Role
          </Link>
        </Button>
      </div>

      <RoleTable roles={roles} />
    </div>
  )
}
