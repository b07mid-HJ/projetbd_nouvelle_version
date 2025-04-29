"use client"

// Define Formation type to match API response
interface Formation {
  id: string
  titre: string
  annee: number
  duree: number
  budget: number
  domaine: { id: string, libelle: string } | null
  formateur: { id: string, nom: string, prenom: string } | null
  participants: { id: string, nom: string, prenom: string }[] | null
}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFormation, updateFormation, getDomaines, getFormateurs, getParticipants } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

const formationSchema = z.object({
  titre: z.string().min(2, {
    message: "Titre must be at least 2 characters.",
  }),
  annee: z.coerce.number().int().min(2000, {
    message: "Année must be at least 2000.",
  }),
  duree: z.coerce.number().int().min(1, {
    message: "Durée must be at least 1 day.",
  }),
  domaineId: z.string({
    required_error: "Please select a domaine.",
  }),
  budget: z.coerce.number().min(0, {
    message: "Budget must be a positive number.",
  }),
  formateurId: z.string().transform(val => val === "none" ? "" : val),
  participantIds: z.array(z.string()).default([]),
})

type FormationFormValues = z.infer<typeof formationSchema>

interface FormationFormProps {
  formation?: Formation
}

export function FormationForm({ formation }: FormationFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!formation

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: getDomaines,
    initialData: [], // Provide initial data to avoid undefined
  })

  const { data: formateurs = [] } = useQuery({
    queryKey: ["formateurs"],
    queryFn: getFormateurs,
    initialData: [], // Provide initial data to avoid undefined
  })

  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: getParticipants,
    initialData: [], // Provide initial data to avoid undefined
  })

  const form = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
    defaultValues: formation ? {
      titre: formation.titre,
      annee: formation.annee,
      duree: formation.duree,
      domaineId: formation.domaine?.id || "",
      budget: formation.budget,
      formateurId: formation.formateur?.id || "none", // Use "none" instead of empty string
      participantIds: formation.participants?.map(p => p.id) || [],
    } : {
      titre: "",
      annee: new Date().getFullYear(),
      duree: 1,
      domaineId: "",
      budget: 0,
      formateurId: "none", // Use "none" instead of empty string
      participantIds: [],
    },
  })

  async function onSubmit(values: FormationFormValues) {
    try {
      const formData = new FormData()
      
      // Handle regular fields, handling special case for formateurId
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'participantIds') {
          // Skip empty formateur ID or transform "none" to empty string
          if (key === 'formateurId' && value === 'none') {
            // Either skip it entirely or set it to empty (depends on API expectations)
            formData.append(key, '')
          } else {
            formData.append(key, value.toString())
          }
        }
      })
      
      // Handle participant IDs array properly
      if (values.participantIds && values.participantIds.length > 0) {
        values.participantIds.forEach(id => {
          formData.append('participantIds', id)
        })
      }

      const result = isEditing 
        ? await updateFormation(formation.id, formData) 
        : await createFormation(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Formation updated" : "Formation created",
          description: isEditing
            ? "The formation has been updated successfully."
            : "The formation has been created successfully.",
        })
        router.push(isEditing ? `/formations/${formation.id}` : "/formations")
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
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Formation title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Année</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée (jours)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domaineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domaine</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domaine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {domaines.map((domaine) => (
                      <SelectItem key={domaine.id} value={domaine.id}>
                        {domaine.libelle}
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (€)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formateurId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formateur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select formateur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {formateurs.map((formateur) => (
                      <SelectItem key={formateur.id} value={formateur.id}>
                        {formateur.prenom} {formateur.nom}
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
            name="participantIds"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <div className="flex justify-between items-center">
                  <FormLabel>Participants</FormLabel>
                  <span className="text-sm text-muted-foreground">
                    {field.value.length} participant(s) selected
                  </span>
                </div>
                <div className="border rounded-md p-4 mt-2">
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        placeholder="Search participants..."
                        className="w-full p-2 border rounded-md mr-2"
                        onChange={(e) => {
                          const searchElement = document.getElementById('participant-search');
                          if (searchElement) {
                            const searchTerm = e.target.value.toLowerCase();
                            const participantElements = document.querySelectorAll('.participant-item');
                            participantElements.forEach((el) => {
                              const participantEl = el as HTMLElement;
                              const text = participantEl.textContent?.toLowerCase() || '';
                              if (text.includes(searchTerm)) {
                                participantEl.style.display = 'flex';
                              } else {
                                participantEl.style.display = 'none';
                              }
                            });
                          }
                        }}
                        id="participant-search"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allIds = participants.map(p => p.id);
                          const newValue = field.value.length < participants.length ? allIds : [];
                          field.onChange(newValue);
                        }}
                      >
                        {field.value.length < participants.length ? "Select All" : "Deselect All"}
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-4">
                    {/* Group participants by structure if available */}
                    {participants.length > 0 && (
                      <>
                        {/* Get unique structures */}
                        {Array.from(new Set(participants.map(p => p.structure?.libelle || p.structureId || 'No Structure'))).map(structureName => (
                          <div key={structureName} className="mb-2">
                            <div className="text-sm font-medium text-muted-foreground mb-1 border-b pb-1">{structureName}</div>
                            <div className="space-y-2 pl-2">
                              {participants
                                .filter(p => (p.structure?.libelle || p.structureId || 'No Structure') === structureName)
                                .map((participant) => (
                                  <div key={participant.id} className="flex items-center space-x-2 participant-item">
                                    <input
                                      type="checkbox"
                                      id={`participant-${participant.id}`}
                                      value={participant.id}
                                      checked={field.value.includes(participant.id)}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const newValues = e.target.checked
                                          ? [...field.value, value]
                                          : field.value.filter((id) => id !== value);
                                        field.onChange(newValues);
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`participant-${participant.id}`} className="text-sm flex items-center">
                                      {participant.prenom} {participant.nom}
                                      {isEditing && formation?.participants?.some(p => p.id === participant.id) && (
                                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                          Already assigned
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  {participants.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">No participants available</p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/formations/${formation.id}` : "/formations")}
          >
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Formation" : "Create Formation"}</Button>
        </div>
      </form>
    </Form>
  )
}