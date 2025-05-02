"use client"

import type { Employeur } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createEmployeur, updateEmployeur } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const employeurSchema = z.object({
  nomEmployeur: z.string().min(2, {
    message: "Employer name must be at least 2 characters.",
  }),
})

type EmployeurFormValues = z.infer<typeof employeurSchema>

interface EmployeurFormProps {
  employeur?: Employeur
}

export function EmployeurForm({ employeur }: EmployeurFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!employeur

  const form = useForm<EmployeurFormValues>({
    resolver: zodResolver(employeurSchema),
    defaultValues: employeur ? {
      // Map API field name to form field name
      nomEmployeur: employeur.nomemployeur,
    } : {
      nomEmployeur: "",
    },
  })

  async function onSubmit(values: EmployeurFormValues) {
    try {
      const formData = new FormData()
      // Ensure we're using the correct field name for the API
      formData.append("nomEmployeur", values.nomEmployeur)

      const result = isEditing ? await updateEmployeur(employeur.id, formData) : await createEmployeur(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Employer updated" : "Employer created",
          description: isEditing
            ? "The employer has been updated successfully."
            : "The employer has been created successfully.",
        })
        router.push(isEditing ? `/employeurs/${employeur.id}` : "/employeurs")
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
        <FormField
          control={form.control}
          name="nomEmployeur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employer Name</FormLabel>
              <FormControl>
                <Input placeholder="Employer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/employeurs/${employeur.id}` : "/employeurs")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Employeur" : "Create Employeur"}</Button>
        </div>
      </form>
    </Form>
  )
}
