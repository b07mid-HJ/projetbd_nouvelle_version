import { getFormateurs, getParticipants, getFormations, getDomaines, getStructures, getEmployeurs, getProfils, getUtilisateurs } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Building2, 
  Briefcase, 
  UserCircle, 
  ShieldCheck 
} from "lucide-react"
import { AreaChart } from "@/components/ui/area-chart"
import { MultiAreaChart } from "@/components/ui/multi-area-chart"
import { BarChart } from "@/components/ui/bar-chart" 

export default async function Home() {
  const formateurs = await getFormateurs()
  const participants = await getParticipants()
  const formations = await getFormations()
  const domaines = await getDomaines()
  const structures = await getStructures()
  const employeurs = await getEmployeurs()
  const profils = await getProfils()
  const utilisateurs = await getUtilisateurs()

  // Generate participants by profile data
  const participantsByProfile = profils.map(profil => {
    // Count participants with this profile
    const count = participants.filter(p => p.profil?.id === profil.id).length
    return {
      name: profil.libelle,
      value: count
    }
  })

  // Generate training data by year
  // Group formations by year
  const formationsByYear = {}
  formations.forEach(formation => {
    const year = formation.annee
    if (!formationsByYear[year]) {
      formationsByYear[year] = {
        completed: 0,
        ongoing: 0,
        planned: 0
      }
    }
    
    // Determine status based on the current date and year
    const currentYear = new Date().getFullYear()
    if (year < currentYear) {
      formationsByYear[year].completed++
    } else if (year === currentYear) {
      formationsByYear[year].ongoing++
    } else {
      formationsByYear[year].planned++
    }
  })

  // Convert to array format for the chart
  const trainingByYearData = Object.entries(formationsByYear).map(([year, counts]) => ({
    name: year,
    completed: counts.completed,
    ongoing: counts.ongoing,
    planned: counts.planned
  }))

  // Sort by year
  trainingByYearData.sort((a, b) => parseInt(a.name) - parseInt(b.name))

  // Generate budget by domain data
  const budgetByDomain = domaines.map(domaine => {
    // Calculate total budget for this domain
    const totalBudget = formations
      .filter(formation => formation.domaine?.id === domaine.id)
      .reduce((sum, formation) => sum + formation.budget, 0)
    
    return {
      name: domaine.libelle,
      value: totalBudget
    }
  })

  const multiAreaSeries = [
    { name: "Completed", dataKey: "completed", color: "hsl(var(--chart-1))" },
    { name: "Ongoing", dataKey: "ongoing", color: "hsl(var(--chart-2))" },
    { name: "Planned", dataKey: "planned", color: "hsl(var(--chart-3))" },
  ]

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
      {/* Stats Cards */}
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
      {/* Charts Section */}
      <div className="grid gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Participants by Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart 
              data={participantsByProfile} 
              height={300}
              showXAxis={true}
              showYAxis={true}
              showGrid={true}
              showTooltip={true}
              yAxisWidth={40}
              strokeWidth={2}
              gradient={true}
              className="h-[300px]"  // Fixed height to ensure proper rendering
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Training Status by Year</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiAreaChart 
              data={trainingByYearData} 
              series={multiAreaSeries}
              height={300}
              showXAxis={true}
              showYAxis={true}
              showGrid={true}
              showTooltip={true}
              showLegend={true}
              yAxisWidth={40}
              strokeWidth={2}
              gradient={true}
              className="h-[300px]"  // Fixed height to ensure proper rendering
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Budget by Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={budgetByDomain} 
              height={300}
              showXAxis={true}
              showYAxis={true}
              showGrid={true}
              showTooltip={true}
              yAxisWidth={80}
              strokeWidth={2}
              layout="vertical"
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}
