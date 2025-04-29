// Types for our data models
export type Formateur = {
  id: string
  nom: string
  prenom: string
  email: string
  tel: string
  type: "interne" | "externe"
  employeur?: {
    id: string
    nomemployeur?: string
  }
  // Fields for frontend compatibility
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  employerId?: string
}

export type Participant = {
  id: string
  // API response fields
  nom?: string
  prenom?: string
  email: string
  tel?: string
  structure?: {
    id: string
    libelle: string
  }
  profil?: {
    id: string
    libelle: string
  }
  formations?: string[]
  
  // Frontend compatibility fields
  firstName?: string
  lastName?: string
  phone?: string
  name?: string
  structureId?: string
  profileId?: string
}

// New types based on the schema
export type Utilisateur = {
  id: string
  login: string
  password: string
  roleId?: string
  role?: Role | { id: string }
}

export type Role = {
  id: string
  nom: string // "simple utilisateur" | "responsable" | "administrateur"
}

export type Profil = {
  id: string
  libelle: string
}

export type Structure = {
  id: string
  libelle: string
}

export type Employeur = {
  id: string
  nomemployeur: string // Changed to match API response format
}

export type Formation = {
  id: string
  titre: string
  annee: number
  duree: number
  domaineId: string
  budget: number
}

export type Domaine = {
  id: string
  libelle: string
}

// Mock data for formateurs
export const formateurs: Formateur[] = [
  {
    id: "f1",
    name: "Jean Dupont",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    specialization: "Web Development",
    bio: "Experienced web developer with 10+ years in the industry. Specializes in JavaScript frameworks and responsive design.",
    joinedDate: "2020-03-15",
    type: "interne",
    employerId: "e1",
  },
  {
    id: "f2",
    name: "Marie Laurent",
    firstName: "Marie",
    lastName: "Laurent",
    email: "marie.laurent@example.com",
    phone: "+33 6 23 45 67 89",
    specialization: "Data Science",
    bio: "Data scientist with expertise in machine learning and statistical analysis. Previously worked at major tech companies.",
    joinedDate: "2021-05-20",
    type: "externe",
    employerId: "e2",
  },
  {
    id: "f3",
    name: "Ahmed Benali",
    firstName: "Ahmed",
    lastName: "Benali",
    email: "ahmed.benali@example.com",
    phone: "+33 6 34 56 78 90",
    specialization: "Mobile Development",
    bio: "Mobile app developer specializing in iOS and Android. Has published several successful apps on both platforms.",
    joinedDate: "2019-11-10",
    type: "interne",
    employerId: "e1",
  },
]

// Mock data for participants
export const participants: Participant[] = [
  {
    id: "p1",
    name: "Sophie Martin",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "+33 6 45 67 89 01",
    enrollmentDate: "2022-01-10",
    status: "active",
    structureId: "s1",
    profileId: "pr1",
    trainingHistory: [
      {
        program: "Web Development Fundamentals",
        startDate: "2022-01-15",
        endDate: "2022-03-15",
        status: "completed",
      },
      {
        program: "Advanced JavaScript",
        startDate: "2022-04-01",
        status: "ongoing",
      },
    ],
  },
  {
    id: "p2",
    name: "Thomas Petit",
    firstName: "Thomas",
    lastName: "Petit",
    email: "thomas.petit@example.com",
    phone: "+33 6 56 78 90 12",
    enrollmentDate: "2021-11-05",
    status: "active",
    structureId: "s2",
    profileId: "pr2",
    trainingHistory: [
      {
        program: "Data Analysis with Python",
        startDate: "2021-11-10",
        endDate: "2022-02-10",
        status: "completed",
      },
    ],
  },
  {
    id: "p3",
    name: "Camille Dubois",
    firstName: "Camille",
    lastName: "Dubois",
    email: "camille.dubois@example.com",
    phone: "+33 6 67 89 01 23",
    enrollmentDate: "2022-02-20",
    status: "inactive",
    structureId: "s1",
    profileId: "pr3",
    trainingHistory: [
      {
        program: "Mobile App Development",
        startDate: "2022-02-25",
        endDate: "2022-04-10",
        status: "dropped",
      },
    ],
  },
  {
    id: "p4",
    name: "Lucas Moreau",
    firstName: "Lucas",
    lastName: "Moreau",
    email: "lucas.moreau@example.com",
    phone: "+33 6 78 90 12 34",
    enrollmentDate: "2021-09-15",
    status: "completed",
    structureId: "s3",
    profileId: "pr1",
    trainingHistory: [
      {
        program: "UX/UI Design Principles",
        startDate: "2021-09-20",
        endDate: "2021-12-20",
        status: "completed",
      },
      {
        program: "Advanced Design Systems",
        startDate: "2022-01-10",
        endDate: "2022-04-10",
        status: "completed",
      },
    ],
  },
]

// Mock data for new entities
export const utilisateurs: Utilisateur[] = [
  {
    id: "u1",
    login: "admin",
    password: "admin123",
    roleId: "r1",
  },
  {
    id: "u2",
    login: "manager",
    password: "manager123",
    roleId: "r2",
  },
  {
    id: "u3",
    login: "user",
    password: "user123",
    roleId: "r3",
  },
]

export const roles: Role[] = [
  {
    id: "r1",
    name: "administrateur",
  },
  {
    id: "r2",
    name: "responsable",
  },
  {
    id: "r3",
    name: "simple utilisateur",
  },
]

export const profils: Profil[] = [
  {
    id: "pr1",
    libelle: "Développeur",
  },
  {
    id: "pr2",
    libelle: "Designer",
  },
  {
    id: "pr3",
    libelle: "Chef de projet",
  },
]

export const structures: Structure[] = [
  {
    id: "s1",
    libelle: "Département IT",
  },
  {
    id: "s2",
    libelle: "Département Marketing",
  },
  {
    id: "s3",
    libelle: "Département RH",
  },
]

export const employeurs: Employeur[] = [
  {
    id: "e1",
    nomEmployeur: "Training Center",
  },
  {
    id: "e2",
    nomEmployeur: "Consultant Group",
  },
  {
    id: "e3",
    nomEmployeur: "Tech Solutions",
  },
]

export const domaines: Domaine[] = [
  {
    id: "d1",
    libelle: "Développement Web",
  },
  {
    id: "d2",
    libelle: "Data Science",
  },
  {
    id: "d3",
    libelle: "Design UX/UI",
  },
  {
    id: "d4",
    libelle: "Management",
  },
]

export const formations: Formation[] = [
  {
    id: "fo1",
    titre: "Introduction au développement web",
    annee: 2023,
    duree: 5,
    domaineId: "d1",
    budget: 2500,
  },
  {
    id: "fo2",
    titre: "Python pour la data science",
    annee: 2023,
    duree: 7,
    domaineId: "d2",
    budget: 3500,
  },
  {
    id: "fo3",
    titre: "Design d'interfaces modernes",
    annee: 2023,
    duree: 4,
    domaineId: "d3",
    budget: 2000,
  },
  {
    id: "fo4",
    titre: "Leadership et gestion d'équipe",
    annee: 2023,
    duree: 3,
    domaineId: "d4",
    budget: 1800,
  },
]
