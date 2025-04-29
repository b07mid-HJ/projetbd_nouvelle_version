"use client"

import type { Participant } from "@/lib/data"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteParticipant } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface ParticipantTableProps {
  participants: Participant[]
}

export function ParticipantTable({ participants }: ParticipantTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteParticipant(deleteId)

    if (result.success) {
      toast({
        title: "Participant deleted",
        description: "The participant has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete participant.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Participant>[] = [
    {
      id: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const participant = row.original
        const firstName = participant.prenom || participant.firstName || ""
        const lastName = participant.nom || participant.lastName || ""
        return <div>{`${firstName} ${lastName}`.trim()}</div>
      },
      accessorFn: (row) => {
        const firstName = row.prenom || row.firstName || ""
        const lastName = row.nom || row.lastName || ""
        return `${firstName} ${lastName}`.trim()
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "phone",
      header: "Phone",
      accessorFn: (row) => row.tel || row.phone || "",
    },
    {
      id: "structure",
      header: "Structure",
      cell: ({ row }) => {
        const participant = row.original
        if (participant.structure?.libelle) return <div>{participant.structure.libelle}</div>
        return <div></div>
      },
      accessorFn: (row) => {
        if (row.structure?.libelle) return row.structure.libelle
        return ""
      },
    },
    {
      id: "profil",
      header: "Profil",
      cell: ({ row }) => {
        const participant = row.original
        if (participant.profil?.libelle) return <div>{participant.profil.libelle}</div>
        return <div></div>
      },
      accessorFn: (row) => {
        if (row.profil?.libelle) return row.profil.libelle
        return ""
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const participant = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/participants/${participant.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/participants/${participant.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(participant.id)}>
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
      <DataTable columns={columns} data={participants} searchKey="email" searchPlaceholder="Search participants..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Participant"
        description="Are you sure you want to delete this participant? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
