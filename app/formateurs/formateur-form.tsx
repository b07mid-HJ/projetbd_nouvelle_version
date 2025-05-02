"use client"

import type { Formateur } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createFormateur, updateFormateur, getEmployeurs } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

const formateurSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  type: z.enum(["interne", "externe"], {
    required_error: "Please select a type.",
  }),
  employerId: z.string().optional(),
})

type FormateurFormValues = z.infer<typeof formateurSchema>

interface FormateurFormProps {
  formateur?: Formateur
}

export function FormateurForm({ formateur }: FormateurFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!formateur
  const [employeurs, setEmployeurs] = useState<any[]>([])

  useEffect(() => {
    const fetchEmployeurs = async () => {
      const data = await getEmployeurs()
      setEmployeurs(data || [])
    }
    fetchEmployeurs()
  }, [])

  const form = useForm<FormateurFormValues>({
    resolver: zodResolver(formateurSchema),
    defaultValues: {
      firstName: formateur?.firstName || formateur?.prenom || "",
      lastName: formateur?.lastName || formateur?.nom || "",
      email: formateur?.email || "",
      phone: formateur?.phone || formateur?.tel || "",
      type: formateur?.type || "externe",
      employerId: formateur?.employerId || formateur?.employeur?.id || "",
    },
  })

  async function onSubmit(values: FormateurFormValues) {
    try {
      const formData = new FormData()
      
      // Map form values to API field names
      formData.append("firstName", values.firstName)
      formData.append("lastName", values.lastName)
      formData.append("email", values.email)
      formData.append("phone", values.phone)
      formData.append("type", values.type)
      if (values.employerId) {
        formData.append("employerId", values.employerId)
      }

      const result = isEditing ? await updateFormateur(formateur.id, formData) : await createFormateur(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Formateur updated" : "Formateur created",
          description: isEditing
            ? "The formateur has been updated successfully."
            : "The formateur has been created successfully.",
        })
        router.push(isEditing ? `/formateurs/${formateur.id}` : "/formateurs")
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+33 6 12 34 56 78" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="externe">Externe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employeur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employeurs.map((employeur) => (
                      <SelectItem key={employeur.id} value={employeur.id}>
                        {employeur.nomemployeur}
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
            onClick={() => router.push(isEditing ? `/formateurs/${formateur.id}` : "/formateurs")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Trainer" : "Create Trainer"}</Button>
        </div>
      </form>
    </Form>
  )
}
