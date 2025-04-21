"use client"

import type { Formation } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFormation, updateFormation, getDomaines } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

const formationSchema = z.object({
  titre: z.string().min(2, {
    message: "Titre must be at least 2 characters.",
  }),
  annee: z.coerce.number().int().min(2000, {
    message: "Année must be at least 2000.",
  }),
  duree: z.coerce.number().int().min(1, {
    message: "Durée must be at least 1 day.",
  }),
  domaineId: z.string({
    required_error: "Please select a domaine.",
  }),
  budget: z.coerce.number().min(0, {
    message: "Budget must be a positive number.",
  }),
})

type FormationFormValues = z.infer<typeof formationSchema>

interface FormationFormProps {
  formation?: Formation
}

export function FormationForm({ formation }: FormationFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!formation

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: getDomaines,
    initialData: [], // Provide initial data to avoid undefined
  })

  const form = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
    defaultValues: formation || {
      titre: "",
      annee: new Date().getFullYear(),
      duree: 1,
      domaineId: "",
      budget: 0,
    },
  })

  async function onSubmit(values: FormationFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      const result = isEditing ? await updateFormation(formation.id, formData) : await createFormation(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Formation updated" : "Formation created",
          description: isEditing
            ? "The formation has been updated successfully."
            : "The formation has been created successfully.",
        })
        router.push(isEditing ? `/formations/${formation.id}` : "/formations")
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Formation title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Année</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée (jours)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domaineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domaine</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domaine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {domaines.map((domaine) => (
                      <SelectItem key={domaine.id} value={domaine.id}>
                        {domaine.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (€)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/formations/${formation.id}` : "/formations")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Formation" : "Create Formation"}</Button>
        </div>
      </form>
    </Form>
  )
}
