import { getRoleById } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

interface RoleDetailPageProps {
  params: {
    id: string
  }
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  const role = await getRoleById(params.id)

  if (!role) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/roles">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{role.nom}</h1>
        </div>
        <Button asChild>
          <Link href={`/roles/${role.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Role
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Name</div>
            <div>{role.nom}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
