// src/components/layout/navigation.tsx
"use client"

import { useState } from "react"
import { Music, Home, Settings, User, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [activeItem, setActiveItem] = useState("home")

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "playlists",
      label: "My Playlists",
      icon: Music,
      href: "/playlists",
    },
    {
      id: "discover",
      label: "Discover",
      icon: Sparkles,
      href: "/discover",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-2", className)}>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = activeItem === item.id

        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 h-12 px-4",
              isActive && "bg-spotify-green/10 text-spotify-green hover:bg-spotify-green/20"
            )}
            onClick={() => setActiveItem(item.id)}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Button>
        )
      })}

      {/* Divider */}
      <div className="my-4 border-t" />

      {/* Logout */}
      <Button
        variant="ghost"
        className="justify-start gap-3 h-12 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Logout</span>
      </Button>
    </nav>
  )
}
