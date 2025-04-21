"use client"

import type { Utilisateur } from "@/lib/data"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteUtilisateur } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { getRoles } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"

interface UtilisateurTableProps {
  utilisateurs: Utilisateur[]
}

export function UtilisateurTable({ utilisateurs }: UtilisateurTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    initialData: [], // Provide initial data to avoid undefined
  })

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteUtilisateur(deleteId)

    if (result.success) {
      toast({
        title: "Utilisateur deleted",
        description: "The utilisateur has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete utilisateur.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Utilisateur>[] = [
    {
      accessorKey: "login",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Login
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "roleId",
      header: "Role",
      cell: ({ row }) => {
        const roleId = row.getValue("roleId") as string
        const role = roles.find((r) => r.id === roleId)
        return <div>{role?.name || "Unknown"}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const utilisateur = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/utilisateurs/${utilisateur.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/utilisateurs/${utilisateur.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(utilisateur.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={utilisateurs} searchKey="login" searchPlaceholder="Search utilisateurs..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Utilisateur"
        description="Are you sure you want to delete this utilisateur? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
