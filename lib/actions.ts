"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
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

// Authentication actions

export async function loginUser(username: string, password: string) {
  try {
    // Check if the backend is accessible
    const response = await fetch("http://localhost:8080/api/utilisateur/check-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: username, password: password }),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Login error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Invalid username or password. Please check your credentials or verify that the backend server is running."
    }
  }
}

// Formateur actions - API integration

export async function getFormateurs() {
  try {
    const response = await fetch('http://localhost:8080/api/formateur')
    if (!response.ok) throw new Error('Failed to fetch formateurs')
    const data = await response.json()
    // Map API response to frontend format
    return data
  } catch (error) {
    console.error('Error fetching formateurs:', error)
    return []
  }
}

export async function getFormateurById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/formateur/${id}`)
    if (!response.ok) throw new Error('Failed to fetch formateur')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching formateur ${id}:`, error)
    return null
  }
}

export async function createFormateur(formData: FormData) {
  try {
    const nom = formData.get("lastName") as string
    const prenom = formData.get("firstName") as string
    const email = formData.get("email") as string
    const tel = formData.get("phone") as string
    const type = formData.get("type") as "interne" | "externe"
    const employeurId = formData.get("employerId") as string

    const response = await fetch('http://localhost:8080/api/formateur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        tel,
        type,
        employeur: employeurId ? {
          id: employeurId
        } : null
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create formateur' }
    }

    const formateur = await response.json()
    revalidatePath("/formateurs")
    return { success: true, formateur }
  } catch (error) {
    console.error('Error creating formateur:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateFormateur(id: string, formData: FormData) {
  try {
    const nom = formData.get("lastName") as string
    const prenom = formData.get("firstName") as string
    const email = formData.get("email") as string
    const tel = formData.get("phone") as string
    const type = formData.get("type") as "interne" | "externe"
    const employeurId = formData.get("employerId") as string

    const response = await fetch(`http://localhost:8080/api/formateur`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        nom,
        prenom,
        email,
        tel,
        type,
        employeur: employeurId ? {
          id: employeurId
        } : null
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update formateur' }
    }

    const formateur = await response.json()
    revalidatePath("/formateurs")
    return { success: true, formateur }
  } catch (error) {
    console.error(`Error updating formateur ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteFormateur(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/formateur/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete formateur' }
    }

    revalidatePath("/formateurs")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting formateur ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Participant actions - API integration
export async function getParticipants() {
  try {
    const response = await fetch('http://localhost:8080/api/participant')
    if (!response.ok) throw new Error('Failed to fetch participants')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching participants:', error)
    return []
  }
}

export async function getParticipantById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/participant/${id}`)
    if (!response.ok) throw new Error('Failed to fetch participant')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching participant ${id}:`, error)
    return null
  }
}

export async function createParticipant(formData: FormData) {
  try {
    const nom = formData.get("lastName") as string
    const prenom = formData.get("firstName") as string
    const email = formData.get("email") as string
    const tel = formData.get("phone") as string
    const structureId = formData.get("structureId") as string
    const profilId = formData.get("profileId") as string
    const formationIds = formData.getAll("formationIds") as string[]

    const response = await fetch('http://localhost:8080/api/participant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        tel,
        structure: structureId ? {
          id: structureId
        } : null,
        profil: profilId ? {
          id: profilId
        } : null,
        formationIds: formationIds.length > 0 ? formationIds : []
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create participant' }
    }

    const participant = await response.json()
    revalidatePath("/participants")
    return { success: true, participant }
  } catch (error) {
    console.error('Error creating participant:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateParticipant(id: string, formData: FormData) {
  try {
    const nom = formData.get("lastName") as string
    const prenom = formData.get("firstName") as string
    const email = formData.get("email") as string
    const tel = formData.get("phone") as string
    const structureId = formData.get("structureId") as string
    const profilId = formData.get("profileId") as string
    const formationIds = formData.getAll("formationIds") as string[]

    const response = await fetch(`http://localhost:8080/api/participant`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        nom,
        prenom,
        email,
        tel,
        structure: structureId ? {
          id: structureId
        } : null,
        profil: profilId ? {
          id: profilId
        } : null,
        formationIds: formationIds.length > 0 ? formationIds : []
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update participant' }
    }

    const participant = await response.json()
    revalidatePath("/participants")
    return { success: true, participant }
  } catch (error) {
    console.error(`Error updating participant ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteParticipant(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/participant/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete participant' }
    }

    revalidatePath("/participants")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting participant ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function addTrainingToParticipant(participantId: string, formData: FormData) {
  try {
    const formationId = formData.get("formationId") as string
    
    // First get the participant to check current formations
    const participantResponse = await fetch(`http://localhost:8080/api/participant/${participantId}`)
    if (!participantResponse.ok) {
      return { success: false, error: "Failed to fetch participant data" }
    }
    
    const participant = await participantResponse.json()
    
    // Get current formation IDs - handle both array of objects and array of IDs
    let currentFormationIds = []
    if (participant.formations) {
      // Check if formations is an array of objects with id property
      if (participant.formations.length > 0 && typeof participant.formations[0] === 'object') {
        currentFormationIds = participant.formations.map((f: any) => f.id)
      } else {
        // It might already be an array of IDs
        currentFormationIds = participant.formations
      }
    }
    
    // Add the new formation ID if it's not already in the list
    if (!currentFormationIds.includes(formationId)) {
      const updatedFormationIds = [...currentFormationIds, formationId]
      
      // Update the participant with the new formation
      const response = await fetch(`http://localhost:8080/api/participant`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: participantId,
          nom: participant.nom,
          prenom: participant.prenom,
          email: participant.email,
          tel: participant.tel,
          structure: participant.structure ? {
            id: participant.structure.id
          } : null,
          profil: participant.profil ? {
            id: participant.profil.id
          } : null,
          formationIds: updatedFormationIds
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        return { success: false, error: errorData.message || 'Failed to add participant to formation' }
      }

      const updatedParticipant = await response.json()
      revalidatePath(`/participants/${participantId}`)
      revalidatePath("/formations")
      return { success: true, participant: updatedParticipant }
    } else {
      // Formation is already assigned to this participant
      return { success: true, message: "Participant is already enrolled in this formation" }
    }
  } catch (error) {
    console.error(`Error adding participant ${participantId} to formation:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Utilisateur actions - API integration
export async function getUtilisateurs() {
  try {
    const response = await fetch('http://localhost:8080/api/utilisateur')
    if (!response.ok) throw new Error('Failed to fetch utilisateurs')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching utilisateurs:', error)
    return []
  }
}

export async function getUtilisateurById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/utilisateur/${id}`)
    if (!response.ok) throw new Error('Failed to fetch utilisateur')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching utilisateur ${id}:`, error)
    return null
  }
}

export async function createUtilisateur(formData: FormData) {
  try {
    const login = formData.get("login") as string
    const password = formData.get("password") as string
    const roleId = formData.get("roleId") as string

    const response = await fetch('http://localhost:8080/api/utilisateur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
        role: {
          id: roleId
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create utilisateur' }
    }

    const utilisateur = await response.json()
    revalidatePath("/utilisateurs")
    return { success: true, utilisateur }
  } catch (error) {
    console.error('Error creating utilisateur:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateUtilisateur(id: string, formData: FormData) {
  try {
    const login = formData.get("login") as string
    const password = formData.get("password") as string
    const roleId = formData.get("roleId") as string

    const response = await fetch(`http://localhost:8080/api/utilisateur`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        login,
        password,
        role: {
          id: roleId
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update utilisateur' }
    }

    const utilisateur = await response.json()
    revalidatePath("/utilisateurs")
    return { success: true, utilisateur }
  } catch (error) {
    console.error(`Error updating utilisateur ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteUtilisateur(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/utilisateur/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete utilisateur' }
    }

    revalidatePath("/utilisateurs")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting utilisateur ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Role actions - API integration
export async function getRoles() {
  try {
    const response = await fetch('http://localhost:8080/api/role')
    if (!response.ok) throw new Error('Failed to fetch roles')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching roles:', error)
    return []
  }
}

export async function getRoleById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/role/${id}`)
    if (!response.ok) throw new Error('Failed to fetch role')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error)
    return null
  }
}

export async function createRole(formData: FormData) {
  try {
    const nom = formData.get("nom") as string
    
    // Validate that the role name is one of the allowed values
    if (!['simple', 'responsable', 'admin'].includes(nom)) {
      return { 
        success: false, 
        error: "Role name must be one of: simple, responsable, admin" 
      }
    }

    const response = await fetch('http://localhost:8080/api/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create role' }
    }

    const role = await response.json()
    revalidatePath("/roles")
    return { success: true, role }
  } catch (error) {
    console.error('Error creating role:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateRole(id: string, formData: FormData) {
  try {
    const nom = formData.get("nom") as string
    
    // Validate that the role name is one of the allowed values
    if (!['simple', 'responsable', 'admin'].includes(nom)) {
      return { 
        success: false, 
        error: "Role name must be one of: simple, responsable, admin" 
      }
    }

    const response = await fetch(`http://localhost:8080/api/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        nom
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update role' }
    }

    const role = await response.json()
    revalidatePath("/roles")
    return { success: true, role }
  } catch (error) {
    console.error(`Error updating role ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteRole(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/role/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete role' }
    }

    revalidatePath("/roles")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Profil actions - API Integration
export async function getProfils() {
  try {
    const response = await fetch('http://localhost:8080/api/profil')
    if (!response.ok) throw new Error('Failed to fetch profils')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching profils:', error)
    return []
  }
}

export async function getProfilById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/profil/${id}`)
    if (!response.ok) throw new Error('Failed to fetch profil')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching profil ${id}:`, error)
    return null
  }
}

export async function createProfil(formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch('http://localhost:8080/api/profil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create profil' }
    }

    const profil = await response.json()
    revalidatePath("/profils")
    return { success: true, profil }
  } catch (error) {
    console.error('Error creating profil:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateProfil(id: string, formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch(`http://localhost:8080/api/profil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update profil' }
    }

    const profil = await response.json()
    revalidatePath("/profils")
    return { success: true, profil }
  } catch (error) {
    console.error(`Error updating profil ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteProfil(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/profil/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete profil' }
    }

    revalidatePath("/profils")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting profil ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Structure actions - API Integration
export async function getStructures() {
  try {
    const response = await fetch('http://localhost:8080/api/structure')
    if (!response.ok) throw new Error('Failed to fetch structures')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching structures:', error)
    return []
  }
}

export async function getStructureById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/structure/${id}`)
    if (!response.ok) throw new Error('Failed to fetch structure')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching structure ${id}:`, error)
    return null
  }
}

export async function createStructure(formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch('http://localhost:8080/api/structure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create structure' }
    }

    const structure = await response.json()
    revalidatePath("/structures")
    return { success: true, structure }
  } catch (error) {
    console.error('Error creating structure:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateStructure(id: string, formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch(`http://localhost:8080/api/structure`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update structure' }
    }

    const structure = await response.json()
    revalidatePath("/structures")
    return { success: true, structure }
  } catch (error) {
    console.error(`Error updating structure ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteStructure(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/structure/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete structure' }
    }

    revalidatePath("/structures")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting structure ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Employeur actions - API Integration
export async function getEmployeurs() {
  try {
    const response = await fetch('http://localhost:8080/api/employeur', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching employeurs: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch employeurs:', error)
    return []
  }
}

export async function getEmployeurById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/employeur/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error fetching employeur: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch employeur with id ${id}:`, error)
    return null
  }
}

export async function createEmployeur(formData: FormData) {
  try {
    const employeurData = {
      nomemployeur: formData.get("nomEmployeur") as string,
    }

    const response = await fetch('http://localhost:8080/api/employeur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeurData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || 'Failed to create employeur' }
    }

    const newEmployeur = await response.json()
    revalidatePath("/employeurs")
    return { success: true, employeur: newEmployeur }
  } catch (error) {
    console.error('Failed to create employeur:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateEmployeur(id: string, formData: FormData) {
  try {
    const employeurData = {
      id: id,
      nomemployeur: formData.get("nomEmployeur") as string,
    }

    const response = await fetch('http://localhost:8080/api/employeur', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeurData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Employeur not found" }
      }
      const errorData = await response.json()
      return { success: false, error: errorData.message || 'Failed to update employeur' }
    }

    const updatedEmployeur = await response.json()
    revalidatePath("/employeurs")
    return { success: true, employeur: updatedEmployeur }
  } catch (error) {
    console.error(`Failed to update employeur with id ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteEmployeur(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/employeur/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Employeur not found" }
      }
      throw new Error(`Error deleting employeur: ${response.status}`)
    }

    revalidatePath("/employeurs")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete employeur with id ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Domaine actions - API Integration
export async function getDomaines() {
  try {
    const response = await fetch('http://localhost:8080/api/domaine')
    if (!response.ok) throw new Error('Failed to fetch domaines')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching domaines:', error)
    return []
  }
}

export async function getDomaineById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/domaine/${id}`)
    if (!response.ok) throw new Error('Failed to fetch domaine')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching domaine ${id}:`, error)
    return null
  }
}

export async function createDomaine(formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch('http://localhost:8080/api/domaine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create domaine' }
    }

    const domaine = await response.json()
    revalidatePath("/domaines")
    return { success: true, domaine }
  } catch (error) {
    console.error('Error creating domaine:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateDomaine(id: string, formData: FormData) {
  try {
    const libelle = formData.get("libelle") as string

    const response = await fetch(`http://localhost:8080/api/domaine`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        libelle
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update domaine' }
    }

    const domaine = await response.json()
    revalidatePath("/domaines")
    return { success: true, domaine }
  } catch (error) {
    console.error(`Error updating domaine ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteDomaine(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/domaine/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete domaine' }
    }

    revalidatePath("/domaines")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting domaine ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Formation actions - API Integration
export async function getFormations() {
  try {
    const response = await fetch('http://localhost:8080/api/formation')
    if (!response.ok) throw new Error('Failed to fetch formations')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching formations:', error)
    return []
  }
}

// Get formations that participant is not enrolled in
export async function getAvailableFormations(participantId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/formation/available/${participantId}`)
    if (!response.ok) throw new Error('Failed to fetch available formations')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching available formations:', error)
    return []
  }
}


export async function getFormationById(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/formation/${id}`)
    if (!response.ok) throw new Error('Failed to fetch formation')
    
    const formation = await response.json()
    
    // If formation has participants, fetch complete participant details for each ID
    if (formation.participants && formation.participants.length > 0) {
      const participantPromises = formation.participants.map(async (participantId: string) => {
        try {
          const participantResponse = await fetch(`http://localhost:8080/api/participant/${participantId}`)
          if (!participantResponse.ok) throw new Error(`Failed to fetch participant ${participantId}`)
          return await participantResponse.json()
        } catch (error) {
          console.error(`Error fetching participant ${participantId}:`, error)
          return { id: participantId, nom: 'Unknown', prenom: 'Unknown' }
        }
      })
      
      formation.participants = await Promise.all(participantPromises)
    }
    
    return formation
  } catch (error) {
    console.error(`Error fetching formation ${id}:`, error)
    return null
  }
}

export async function createFormation(formData: FormData) {
  try {
    const titre = formData.get("titre") as string
    const annee = Number.parseInt(formData.get("annee") as string)
    const duree = Number.parseInt(formData.get("duree") as string)
    const domaineId = formData.get("domaineId") as string
    const budget = Number.parseFloat(formData.get("budget") as string)
    const formateurId = formData.get("formateurId") as string
    const participantIds = formData.getAll("participantIds") as string[]

    const response = await fetch('http://localhost:8080/api/formation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titre,
        annee,
        duree,
        budget,
        domaine: domaineId ? {
          id: domaineId
        } : null,
        formateur: formateurId ? {
          id: formateurId
        } : null,
        participantIds: participantIds.length > 0 ? participantIds : []
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to create formation' }
    }

    const formation = await response.json()
    revalidatePath("/formations")
    return { success: true, formation }
  } catch (error) {
    console.error('Error creating formation:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateFormation(id: string, formData: FormData) {
  try {
    const titre = formData.get("titre") as string
    const annee = Number.parseInt(formData.get("annee") as string)
    const duree = Number.parseInt(formData.get("duree") as string)
    const domaineId = formData.get("domaineId") as string
    const budget = Number.parseFloat(formData.get("budget") as string)
    const formateurId = formData.get("formateurId") as string
    const participantIds = formData.getAll("participantIds") as string[]

    const response = await fetch(`http://localhost:8080/api/formation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        titre,
        annee,
        duree,
        budget,
        domaine: domaineId ? {
          id: domaineId
        } : null,
        formateur: formateurId ? {
          id: formateurId
        } : null,
        participantIds: participantIds.length > 0 ? participantIds : []
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: errorData.message || 'Failed to update formation' }
    }

    const formation = await response.json()
    revalidatePath("/formations")
    return { success: true, formation }
  } catch (error) {
    console.error(`Error updating formation ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteFormation(id: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/formation/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to delete formation' }
    }

    revalidatePath("/formations")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting formation ${id}:`, error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
