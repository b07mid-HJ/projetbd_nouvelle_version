"use client"

import type { Domaine } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createDomaine, updateDomaine } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const domaineSchema = z.object({
  libelle: z.string().min(2, {
    message: "Libelle must be at least 2 characters.",
  }),
})

type DomaineFormValues = z.infer<typeof domaineSchema>

interface DomaineFormProps {
  domaine?: Domaine
}

export function DomaineForm({ domaine }: DomaineFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!domaine

  const form = useForm<DomaineFormValues>({
    resolver: zodResolver(domaineSchema),
    defaultValues: domaine || {
      libelle: "",
    },
  })

  async function onSubmit(values: DomaineFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = isEditing ? await updateDomaine(domaine.id, formData) : await createDomaine(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Domaine updated" : "Domaine created",
          description: isEditing
            ? "The domaine has been updated successfully."
            : "The domaine has been created successfully.",
        })
        router.push(isEditing ? `/domaines/${domaine.id}` : "/domaines")
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
              <FormLabel>Libelle</FormLabel>
              <FormControl>
                <Input placeholder="Domain name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/domaines/${domaine.id}` : "/domaines")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Domaine" : "Create Domaine"}</Button>
        </div>
      </form>
    </Form>
  )
}
