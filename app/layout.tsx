import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { QueryProvider } from "@/components/providers/query-provider"
import { SidebarProvider } from "@/context/sidebar-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Training Center Management",
  description: "CRUD application for managing trainers and trainees",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <div className="min-h-screen flex flex-col">
                <Sidebar />
                <main className="flex-1 py-6 px-4 container mx-auto">
                  <MainContent>{children}</MainContent>
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
