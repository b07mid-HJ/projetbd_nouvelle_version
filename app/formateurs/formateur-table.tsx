"use client"

import type { Formateur } from "@/lib/data"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteFormateur } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface FormateurTableProps {
  formateurs: Formateur[]
}

export function FormateurTable({ formateurs }: FormateurTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteFormateur(deleteId)

    if (result.success) {
      toast({
        title: "Formateur deleted",
        description: "The Trainer has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete Trainer.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Formateur>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        // Handle both API format (nom/prenom) and frontend format (name)
        const formateur = row.original
        const displayName = formateur.name || `${formateur.prenom || ''} ${formateur.nom || ''}`
        return <div>{displayName}</div>
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "employeur",
      header: "Employer",
      cell: ({ row }) => {
        // Specialization might not be in the API response
        return <div>{row.original.employeur?.nomemployeur || 'N/A'}</div>
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {

        return <div>{row.original.type || 'N/A'}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const formateur = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/formateurs/${formateur.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/formateurs/${formateur.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(formateur.id)}>
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
      <DataTable columns={columns} data={formateurs} searchKey="name" searchPlaceholder="Search Trainer..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Trainer"
        description="Are you sure you want to delete this Trainer? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
