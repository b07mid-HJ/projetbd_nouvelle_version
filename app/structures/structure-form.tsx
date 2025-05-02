"use client"

import type { Structure } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createStructure, updateStructure } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const structureSchema = z.object({
  libelle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
})

type StructureFormValues = z.infer<typeof structureSchema>

interface StructureFormProps {
  structure?: Structure
}

export function StructureForm({ structure }: StructureFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!structure

  const form = useForm<StructureFormValues>({
    resolver: zodResolver(structureSchema),
    defaultValues: structure || {
      libelle: "",
    },
  })

  async function onSubmit(values: StructureFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = isEditing ? await updateStructure(structure.id, formData) : await createStructure(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Structure updated" : "Structure created",
          description: isEditing
            ? "The structure has been updated successfully."
            : "The structure has been created successfully.",
        })
        router.push(isEditing ? `/structures/${structure.id}` : "/structures")
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
                <Input placeholder="Structure name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/structures/${structure.id}` : "/structures")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Structure" : "Create Structure"}</Button>
        </div>
      </form>
    </Form>
  )
}
