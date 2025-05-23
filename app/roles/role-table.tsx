"use client"

import type { Role } from "@/lib/data"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteRole } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface RoleTableProps {
  roles: Role[]
}

export function RoleTable({ roles }: RoleTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteRole(deleteId)

    if (result.success) {
      toast({
        title: "Role deleted",
        description: "The role has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete role.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/roles/${role.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/roles/${role.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(role.id)}>
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
      <DataTable columns={columns} data={roles} searchKey="nom" searchPlaceholder="Search roles..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
