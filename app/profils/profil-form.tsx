"use client"

import type { Profil } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createProfil, updateProfil } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const profilSchema = z.object({
  libelle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
})

type ProfilFormValues = z.infer<typeof profilSchema>

interface ProfilFormProps {
  profil?: Profil
}

export function ProfilForm({ profil }: ProfilFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!profil

  const form = useForm<ProfilFormValues>({
    resolver: zodResolver(profilSchema),
    defaultValues: profil || {
      libelle: "",
    },
  })

  async function onSubmit(values: ProfilFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = isEditing ? await updateProfil(profil.id, formData) : await createProfil(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Profil updated" : "Profil created",
          description: isEditing
            ? "The profil has been updated successfully."
            : "The profil has been created successfully.",
        })
        router.push(isEditing ? `/profils/${profil.id}` : "/profils")
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
          name="libelle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Profil name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/profils/${profil.id}` : "/profils")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Profil" : "Create Profil"}</Button>
        </div>
      </form>
    </Form>
  )
}
