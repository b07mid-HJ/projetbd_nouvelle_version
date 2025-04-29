"use client"

// Define Formation type to match API response
interface Formation {
  id: string
  titre: string
  annee: number
  duree: number
  budget: number
  domaine: { id: string, libelle: string } | null
  formateur: { id: string, nom: string, prenom: string } | null
  participants: { id: string, nom: string, prenom: string }[] | null
}
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteFormation, getDomaines } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"

interface FormationTableProps {
  formations: Formation[]
}

export function FormationTable({ formations }: FormationTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: getDomaines,
    initialData: [], // Provide initial data to avoid undefined
  })

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteFormation(deleteId)

    if (result.success) {
      toast({
        title: "Formation deleted",
        description: "The formation has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete formation.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  const columns: ColumnDef<Formation>[] = [
    {
      accessorKey: "titre",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Titre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "annee",
      header: "Année",
    },
    {
      accessorKey: "duree",
      header: "Durée (jours)",
    },
    {
      accessorKey: "domaine",
      header: "Domaine",
      cell: ({ row }) => {
        const domaine = row.getValue("domaine") as { id: string, libelle: string } | null
        return <div>{domaine?.libelle || "Unknown"}</div>
      },
    },
    {
      accessorKey: "formateur",
      header: "Formateur",
      cell: ({ row }) => {
        const formateur = row.getValue("formateur") as { id: string, nom: string, prenom: string } | null
        return <div>{formateur ? `${formateur.prenom} ${formateur.nom}` : "Non assigné"}</div>
      },
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const budget = Number.parseFloat(row.getValue("budget"))
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(budget)
        return <div>{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const formation = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/formations/${formation.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/formations/${formation.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(formation.id)}>
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
      <DataTable columns={columns} data={formations} searchKey="titre" searchPlaceholder="Search formations..." />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Formation"
        description="Are you sure you want to delete this formation? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  )
}
