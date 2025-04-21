"use client"

import type { Profil } from "@/lib/data"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteProfil } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface ProfilTableProps {
  profils: Profil[]
}

export function ProfilTable({ profils }: ProfilTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteProfil(deleteId)

    if (result.success) {
      toast({
        title: "Profil deleted",
        description: "The profil has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete profil.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Profil>[] = [
    {
      accessorKey: "libelle",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Libelle
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const profil = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/profils/${profil.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/profils/${profil.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(profil.id)}>
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
      <DataTable columns={columns} data={profils} searchKey="libelle" searchPlaceholder="Search profils..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Profil"
        description="Are you sure you want to delete this profil? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
