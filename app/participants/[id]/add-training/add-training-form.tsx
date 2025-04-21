"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addTrainingToParticipant } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const trainingSchema = z.object({
  program: z.string().min(2, {
    message: "Program name must be at least 2 characters.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
})

type TrainingFormValues = z.infer<typeof trainingSchema>

interface AddTrainingFormProps {
  participantId: string
}

export function AddTrainingForm({ participantId }: AddTrainingFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      program: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  })

  async function onSubmit(values: TrainingFormValues) {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = await addTrainingToParticipant(participantId, formData)

      if (result.success) {
        toast({
          title: "Training added",
          description: "The training has been added successfully.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Name</FormLabel>
                <FormControl>
                  <Input placeholder="Web Development Fundamentals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/participants/${participantId}`)}>
            Cancel
          </Button>
          <Button type="submit">Add Training</Button>
        </div>
      </form>
    </Form>
  )
}
