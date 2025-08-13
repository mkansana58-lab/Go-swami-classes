"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Shield, BookCopy, BarChart3, Settings, LifeBuoy } from "lucide-react"
import { Header } from "./header"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/courses", label: "All Courses", icon: BookCopy },
    { href: "/progress", label: "My Progress", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <Shield className="h-8 w-8 text-primary" />
                        <span className="text-lg font-bold font-headline text-primary">
                            GSDA
                        </span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {menuItems.map(item => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                 <SidebarMenu className="p-2 mt-auto">
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LifeBuoy />
                            <span>Help & Support</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
            </Sidebar>

            <div className="flex flex-col flex-1">
                 <Header />
                <SidebarInset>
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <footer className="py-6 text-center text-sm text-muted-foreground border-t">
                        © {new Date().getFullYear()} Go Swami Defence Academy. All Rights Reserved.
                    </footer>
                </SidebarInset>
            </div>
        </div>
    )
}
