"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addTrainingToParticipant, getAvailableFormations } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  formationId: z.string({
    required_error: "Please select a formation.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface AddTrainingFormProps {
  participantId: string
}

export function AddTrainingForm({ participantId }: AddTrainingFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  // Fetch available formations (those the participant is not already enrolled in)
  const { data: availableFormations = [], isLoading, isError } = useQuery({
    queryKey: ['availableFormations', participantId],
    queryFn: () => getAvailableFormations(participantId),
    initialData: [],
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formationId: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData()
      formData.append('formationId', values.formationId)

      const result = await addTrainingToParticipant(participantId, formData)

      if (result.success) {
        toast({
          title: "Formation Added",
          description: "The participant has been added to the formation successfully.",
        })
        router.push(`/participants/${participantId}`)
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

  if (isError) {
    return <div className="p-4 text-red-500">Error loading available formations</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="formationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Formation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a formation to join" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading formations...</SelectItem>
                  ) : availableFormations.length === 0 ? (
                    <SelectItem value="none" disabled>No available formations</SelectItem>
                  ) : (
                    availableFormations.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id}>
                        {formation.titre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/participants/${participantId}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || availableFormations.length === 0}>Add to Formation</Button>
        </div>
      </form>
    </Form>
  )
}