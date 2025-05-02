"use client"

import type { Utilisateur, Role } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUtilisateur, updateUtilisateur, getRoles } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

const utilisateurSchema = z.object({
  login: z.string().min(2, {
    message: "Login must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  roleId: z.string({
    required_error: "Please select a role.",
  }),
})

type UtilisateurFormValues = z.infer<typeof utilisateurSchema>

interface UtilisateurFormProps {
  utilisateur?: Utilisateur
}

export function UtilisateurForm({ utilisateur }: UtilisateurFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!utilisateur

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    initialData: [], // Provide initial data to avoid undefined
  })

  const form = useForm<UtilisateurFormValues>({
    resolver: zodResolver(utilisateurSchema),
    defaultValues: {
      login: utilisateur?.login || "",
      password: utilisateur?.password || "",
      roleId: utilisateur?.role?.id || utilisateur?.roleId || "",
    },
  })

  async function onSubmit(values: UtilisateurFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = isEditing ? await updateUtilisateur(utilisateur.id, formData) : await createUtilisateur(formData)

      if (result.success) {
        toast({
          title: isEditing ? "User updated" : "User created",
          description: isEditing
            ? "The User has been updated successfully."
            : "The User has been created successfully.",
        })
        router.push(isEditing ? `/utilisateurs/${utilisateur.id}` : "/utilisateurs")
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
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role: Role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/utilisateurs/${utilisateur.id}` : "/utilisateurs")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update User" : "Create User"}</Button>
        </div>
      </form>
    </Form>
  )
}
