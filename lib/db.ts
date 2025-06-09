// Replace MongoDB connection with mock data handler
// This will be replaced with a real database connection later

// Mock data for users
export const users = [
  {
    id: "1",
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    role: "student",
    courses: ["curso-completo"],
    progress: 66,
    joinDate: "2023-05-10",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@ejemplo.com",
    role: "student",
    courses: ["curso-basico"],
    progress: 45,
    joinDate: "2023-05-15",
  },
  {
    id: "3",
    name: "Admin",
    email: "admin@eneagrama.com",
    role: "admin",
    courses: [],
    joinDate: "2023-01-01",
  },
]

// Mock data for courses
export const courses = [
  {
    id: "curso-completo",
    title: "Curso Completo de Eneagrama",
    description:
      "Aprende a tu ritmo con nuestro curso autoguiado, diseñado para transformar tu comprensión de ti mismo y de los demás.",
    price: 129990,
    modules: 9,
  },
  {
    id: "curso-basico",
    title: "Curso Básico de Eneagrama",
    description: "Introducción a los conceptos fundamentales del Eneagrama.",
    price: 89990,
    modules: 4,
  },
  {
    id: "curso-vip",
    title: "Curso VIP de Eneagrama",
    description: "Experiencia personalizada con sesiones individuales.",
    price: 199990,
    modules: 12,
  },
]

// Mock data for videos
export const videos = [
  {
    id: "1",
    title: "Introducción al Eneagrama",
    module: "Módulo 1",
    duration: "15:32",
    status: "publicado",
    watermarked: true,
    uploadDate: "2023-05-10",
    views: 156,
  },
  {
    id: "2",
    title: "Los 9 Tipos de Personalidad",
    module: "Módulo 1",
    duration: "22:45",
    status: "publicado",
    watermarked: true,
    uploadDate: "2023-05-12",
    views: 143,
  },
  // Add more mock videos here as needed
]

// Helper functions to mimic database operations
export async function getUsers() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...users]
}

export async function getUserById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return users.find((user) => user.id === id)
}

export async function getCourses() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [...courses]
}

export async function getVideos() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [...videos]
}

// You can add more mock data and helper functions as needed
