import { getRoleById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { RoleForm } from "../../role-form"

interface EditRolePageProps {
  params: {
    id: string
  }
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const role = await getRoleById(params.id)

  if (!role) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/roles/${role.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
      </div>

      <RoleForm role={role} />
    </div>
  )
}
