"use client"

import type { Participant } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createParticipant, updateParticipant, getStructures, getProfils } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const participantSchema = z.object({
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
  structureId: z.string().optional(),
  profileId: z.string().optional(),
})

type ParticipantFormValues = z.infer<typeof participantSchema>

interface ParticipantFormProps {
  participant?: Participant
}

export function ParticipantForm({ participant }: ParticipantFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!participant
  const [structures, setStructures] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const structuresData = await getStructures()
        const profilesData = await getProfils()
        setStructures(structuresData || [])
        setProfiles(profilesData || [])
      } catch (error) {
        console.error("Error fetching form data:", error)
      }
    }
    fetchData()
  }, [])

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: participant
      ? {
          firstName: participant.prenom || participant.firstName || "",
          lastName: participant.nom || participant.lastName || "",
          email: participant.email || "",
          phone: participant.tel || participant.phone || "",
          structureId: participant.structure?.id || participant.structureId || "",
          profileId: participant.profil?.id || participant.profileId || "",
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          structureId: "",
          profileId: "",
        },
  })

  async function onSubmit(values: ParticipantFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = isEditing ? await updateParticipant(participant.id, formData) : await createParticipant(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Participant updated" : "Participant created",
          description: isEditing
            ? "The participant has been updated successfully."
            : "The participant has been created successfully.",
        })
        router.push(isEditing ? `/participants/${participant.id}` : "/participants")
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
            name="structureId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Structure</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {structures.map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.libelle}
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
            name="profileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.libelle}
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
            onClick={() => router.push(isEditing ? `/participants/${participant.id}` : "/participants")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Participant" : "Create Participant"}</Button>
        </div>
      </form>
    </Form>
  )
}
