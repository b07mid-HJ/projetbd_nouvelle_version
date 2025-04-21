"use server"

import { revalidatePath } from "next/cache"
import {
  formateurs,
  participants,
  utilisateurs,
  roles,
  profils,
  structures,
  employeurs,
  domaines,
  formations,
  type Formateur,
  type Participant,
  type Utilisateur,
  type Role,
  type Profil,
  type Structure,
  type Employeur,
  type Domaine,
  type Formation,
} from "@/lib/data"
import { v4 as uuidv4 } from "uuid"

// Formateur actions
export async function getFormateurs() {
  return formateurs
}

export async function getFormateurById(id: string) {
  return formateurs.find((f) => f.id === id)
}

export async function createFormateur(formData: FormData) {
  const newFormateur: Formateur = {
    id: uuidv4(),
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    specialization: formData.get("specialization") as string,
    bio: formData.get("bio") as string,
    joinedDate: new Date().toISOString().split("T")[0],
    type: formData.get("type") as "interne" | "externe",
    employerId: formData.get("employerId") as string,
  }

  formateurs.push(newFormateur)
  revalidatePath("/formateurs")
  return { success: true, formateur: newFormateur }
}

export async function updateFormateur(id: string, formData: FormData) {
  const index = formateurs.findIndex((f) => f.id === id)
  if (index === -1) return { success: false, error: "Formateur not found" }

  const updatedFormateur: Formateur = {
    id,
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    specialization: formData.get("specialization") as string,
    bio: formData.get("bio") as string,
    joinedDate: formateurs[index].joinedDate,
    type: formData.get("type") as "interne" | "externe",
    employerId: formData.get("employerId") as string,
  }

  formateurs[index] = updatedFormateur
  revalidatePath("/formateurs")
  return { success: true, formateur: updatedFormateur }
}

export async function deleteFormateur(id: string) {
  const index = formateurs.findIndex((f) => f.id === id)
  if (index === -1) return { success: false, error: "Formateur not found" }

  formateurs.splice(index, 1)
  revalidatePath("/formateurs")
  return { success: true }
}

// Participant actions
export async function getParticipants() {
  return participants
}

export async function getParticipantById(id: string) {
  return participants.find((p) => p.id === id)
}

export async function createParticipant(formData: FormData) {
  const newParticipant: Participant = {
    id: uuidv4(),
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "active",
    structureId: formData.get("structureId") as string,
    profileId: formData.get("profileId") as string,
    trainingHistory: [],
  }

  participants.push(newParticipant)
  revalidatePath("/participants")
  return { success: true, participant: newParticipant }
}

export async function updateParticipant(id: string, formData: FormData) {
  const index = participants.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Participant not found" }

  const updatedParticipant: Participant = {
    id,
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    enrollmentDate: participants[index].enrollmentDate,
    status: formData.get("status") as "active" | "inactive" | "completed",
    structureId: formData.get("structureId") as string,
    profileId: formData.get("profileId") as string,
    trainingHistory: participants[index].trainingHistory,
  }

  participants[index] = updatedParticipant
  revalidatePath("/participants")
  return { success: true, participant: updatedParticipant }
}

export async function deleteParticipant(id: string) {
  const index = participants.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Participant not found" }

  participants.splice(index, 1)
  revalidatePath("/participants")
  return { success: true }
}

export async function addTrainingToParticipant(id: string, formData: FormData) {
  const index = participants.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Participant not found" }

  const newTraining = {
    program: formData.get("program") as string,
    startDate: formData.get("startDate") as string,
    status: "ongoing" as const,
  }

  participants[index].trainingHistory.push(newTraining)
  revalidatePath("/participants")
  return { success: true }
}

// Utilisateur actions
export async function getUtilisateurs() {
  return utilisateurs
}

export async function getUtilisateurById(id: string) {
  return utilisateurs.find((u) => u.id === id)
}

export async function createUtilisateur(formData: FormData) {
  const newUtilisateur: Utilisateur = {
    id: uuidv4(),
    login: formData.get("login") as string,
    password: formData.get("password") as string,
    roleId: formData.get("roleId") as string,
  }

  utilisateurs.push(newUtilisateur)
  revalidatePath("/utilisateurs")
  return { success: true, utilisateur: newUtilisateur }
}

export async function updateUtilisateur(id: string, formData: FormData) {
  const index = utilisateurs.findIndex((u) => u.id === id)
  if (index === -1) return { success: false, error: "Utilisateur not found" }

  const updatedUtilisateur: Utilisateur = {
    id,
    login: formData.get("login") as string,
    password: formData.get("password") as string,
    roleId: formData.get("roleId") as string,
  }

  utilisateurs[index] = updatedUtilisateur
  revalidatePath("/utilisateurs")
  return { success: true, utilisateur: updatedUtilisateur }
}

export async function deleteUtilisateur(id: string) {
  const index = utilisateurs.findIndex((u) => u.id === id)
  if (index === -1) return { success: false, error: "Utilisateur not found" }

  utilisateurs.splice(index, 1)
  revalidatePath("/utilisateurs")
  return { success: true }
}

// Role actions
export async function getRoles() {
  return roles
}

export async function getRoleById(id: string) {
  return roles.find((r) => r.id === id)
}

export async function createRole(formData: FormData) {
  const newRole: Role = {
    id: uuidv4(),
    name: formData.get("name") as string,
  }

  roles.push(newRole)
  revalidatePath("/roles")
  return { success: true, role: newRole }
}

export async function updateRole(id: string, formData: FormData) {
  const index = roles.findIndex((r) => r.id === id)
  if (index === -1) return { success: false, error: "Role not found" }

  const updatedRole: Role = {
    id,
    name: formData.get("name") as string,
  }

  roles[index] = updatedRole
  revalidatePath("/roles")
  return { success: true, role: updatedRole }
}

export async function deleteRole(id: string) {
  const index = roles.findIndex((r) => r.id === id)
  if (index === -1) return { success: false, error: "Role not found" }

  roles.splice(index, 1)
  revalidatePath("/roles")
  return { success: true }
}

// Profil actions
export async function getProfils() {
  return profils
}

export async function getProfilById(id: string) {
  return profils.find((p) => p.id === id)
}

export async function createProfil(formData: FormData) {
  const newProfil: Profil = {
    id: uuidv4(),
    libelle: formData.get("libelle") as string,
  }

  profils.push(newProfil)
  revalidatePath("/profils")
  return { success: true, profil: newProfil }
}

export async function updateProfil(id: string, formData: FormData) {
  const index = profils.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Profil not found" }

  const updatedProfil: Profil = {
    id,
    libelle: formData.get("libelle") as string,
  }

  profils[index] = updatedProfil
  revalidatePath("/profils")
  return { success: true, profil: updatedProfil }
}

export async function deleteProfil(id: string) {
  const index = profils.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Profil not found" }

  profils.splice(index, 1)
  revalidatePath("/profils")
  return { success: true }
}

// Structure actions
export async function getStructures() {
  return structures
}

export async function getStructureById(id: string) {
  return structures.find((s) => s.id === id)
}

export async function createStructure(formData: FormData) {
  const newStructure: Structure = {
    id: uuidv4(),
    libelle: formData.get("libelle") as string,
  }

  structures.push(newStructure)
  revalidatePath("/structures")
  return { success: true, structure: newStructure }
}

export async function updateStructure(id: string, formData: FormData) {
  const index = structures.findIndex((s) => s.id === id)
  if (index === -1) return { success: false, error: "Structure not found" }

  const updatedStructure: Structure = {
    id,
    libelle: formData.get("libelle") as string,
  }

  structures[index] = updatedStructure
  revalidatePath("/structures")
  return { success: true, structure: updatedStructure }
}

export async function deleteStructure(id: string) {
  const index = structures.findIndex((s) => s.id === id)
  if (index === -1) return { success: false, error: "Structure not found" }

  structures.splice(index, 1)
  revalidatePath("/structures")
  return { success: true }
}

// Employeur actions
export async function getEmployeurs() {
  return employeurs
}

export async function getEmployeurById(id: string) {
  return employeurs.find((e) => e.id === id)
}

export async function createEmployeur(formData: FormData) {
  const newEmployeur: Employeur = {
    id: uuidv4(),
    nomEmployeur: formData.get("nomEmployeur") as string,
  }

  employeurs.push(newEmployeur)
  revalidatePath("/employeurs")
  return { success: true, employeur: newEmployeur }
}

export async function updateEmployeur(id: string, formData: FormData) {
  const index = employeurs.findIndex((e) => e.id === id)
  if (index === -1) return { success: false, error: "Employeur not found" }

  const updatedEmployeur: Employeur = {
    id,
    nomEmployeur: formData.get("nomEmployeur") as string,
  }

  employeurs[index] = updatedEmployeur
  revalidatePath("/employeurs")
  return { success: true, employeur: updatedEmployeur }
}

export async function deleteEmployeur(id: string) {
  const index = employeurs.findIndex((e) => e.id === id)
  if (index === -1) return { success: false, error: "Employeur not found" }

  employeurs.splice(index, 1)
  revalidatePath("/employeurs")
  return { success: true }
}

// Domaine actions
export async function getDomaines() {
  return domaines
}

export async function getDomaineById(id: string) {
  return domaines.find((d) => d.id === id)
}

export async function createDomaine(formData: FormData) {
  const newDomaine: Domaine = {
    id: uuidv4(),
    libelle: formData.get("libelle") as string,
  }

  domaines.push(newDomaine)
  revalidatePath("/domaines")
  return { success: true, domaine: newDomaine }
}

export async function updateDomaine(id: string, formData: FormData) {
  const index = domaines.findIndex((d) => d.id === id)
  if (index === -1) return { success: false, error: "Domaine not found" }

  const updatedDomaine: Domaine = {
    id,
    libelle: formData.get("libelle") as string,
  }

  domaines[index] = updatedDomaine
  revalidatePath("/domaines")
  return { success: true, domaine: updatedDomaine }
}

export async function deleteDomaine(id: string) {
  const index = domaines.findIndex((d) => d.id === id)
  if (index === -1) return { success: false, error: "Domaine not found" }

  domaines.splice(index, 1)
  revalidatePath("/domaines")
  return { success: true }
}

// Formation actions
export async function getFormations() {
  return formations
}

export async function getFormationById(id: string) {
  return formations.find((f) => f.id === id)
}

export async function createFormation(formData: FormData) {
  const newFormation: Formation = {
    id: uuidv4(),
    titre: formData.get("titre") as string,
    annee: Number.parseInt(formData.get("annee") as string),
    duree: Number.parseInt(formData.get("duree") as string),
    domaineId: formData.get("domaineId") as string,
    budget: Number.parseFloat(formData.get("budget") as string),
  }

  formations.push(newFormation)
  revalidatePath("/formations")
  return { success: true, formation: newFormation }
}

export async function updateFormation(id: string, formData: FormData) {
  const index = formations.findIndex((f) => f.id === id)
  if (index === -1) return { success: false, error: "Formation not found" }

  const updatedFormation: Formation = {
    id,
    titre: formData.get("titre") as string,
    annee: Number.parseInt(formData.get("annee") as string),
    duree: Number.parseInt(formData.get("duree") as string),
    domaineId: formData.get("domaineId") as string,
    budget: Number.parseFloat(formData.get("budget") as string),
  }

  formations[index] = updatedFormation
  revalidatePath("/formations")
  return { success: true, formation: updatedFormation }
}

export async function deleteFormation(id: string) {
  const index = formations.findIndex((f) => f.id === id)
  if (index === -1) return { success: false, error: "Formation not found" }

  formations.splice(index, 1)
  revalidatePath("/formations")
  return { success: true }
}
