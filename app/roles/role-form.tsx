"use client"

import type { Role } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createRole, updateRole } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const roleSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleFormProps {
  role?: Role
}

export function RoleForm({ role }: RoleFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!role

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: role || {
      name: "",
    },
  })

  async function onSubmit(values: RoleFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = isEditing ? await updateRole(role.id, formData) : await createRole(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Role updated" : "Role created",
          description: isEditing
            ? "The role has been updated successfully."
            : "The role has been created successfully.",
        })
        router.push(isEditing ? `/roles/${role.id}` : "/roles")
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Role name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/roles/${role.id}` : "/roles")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Role" : "Create Role"}</Button>
        </div>
      </form>
    </Form>
  )
}
