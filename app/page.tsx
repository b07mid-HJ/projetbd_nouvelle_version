import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Building2, Briefcase, UserCircle, ShieldCheck, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  getFormateurs,
  getParticipants,
  getFormations,
  getDomaines,
  getStructures,
  getEmployeurs,
  getProfils,
  getUtilisateurs,
} from "@/lib/actions"

export default async function Home() {
  const formateurs = await getFormateurs()
  const participants = await getParticipants()
  const formations = await getFormations()
  const domaines = await getDomaines()
  const structures = await getStructures()
  const employeurs = await getEmployeurs()
  const profils = await getProfils()
  const utilisateurs = await getUtilisateurs()

  const dashboardItems = [
    {
      title: "Formateurs",
      count: formateurs.length,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      href: "/formateurs",
      description: "Trainers registered in the system",
    },
    {
      title: "Participants",
      count: participants.length,
      icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
      href: "/participants",
      description: "Trainees enrolled in programs",
    },
    {
      title: "Formations",
      count: formations.length,
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
      href: "/formations",
      description: "Training programs available",
    },
    {
      title: "Domaines",
      count: domaines.length,
      icon: <Layers className="h-4 w-4 text-muted-foreground" />,
      href: "/domaines",
      description: "Training domains",
    },
    {
      title: "Structures",
      count: structures.length,
      icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
      href: "/structures",
      description: "Organizational structures",
    },
    {
      title: "Employeurs",
      count: employeurs.length,
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      href: "/employeurs",
      description: "Employers of trainers",
    },
    {
      title: "Profils",
      count: profils.length,
      icon: <UserCircle className="h-4 w-4 text-muted-foreground" />,
      href: "/profils",
      description: "Participant profiles",
    },
    {
      title: "Utilisateurs",
      count: utilisateurs.length,
      icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
      href: "/utilisateurs",
      description: "System users",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Training Center Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <Button asChild className="mt-4 w-full" size="sm">
                <Link href={item.href}>Manage {item.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
