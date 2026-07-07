"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, BotIcon, BookOpenIcon, BrainCircuit, UserRoundPen, Receipt } from "lucide-react"
import Image from "next/image"
import { IUserResponse } from "@/interface/response/user.response"

const isCurrentPath = (path: string) => {
  if (typeof window !== "undefined") {
    return window.location.pathname === path
  }
  return false
}

// This is sample data.
const data = {
  navMain: [
    {
      title: "Jobs",
      url: "/alljobs",
      icon: <TerminalSquareIcon />,
      isActive: isCurrentPath("/alljobs"),
      items: [
        { title: "All Jobs", url: "/alljobs" , isActive: isCurrentPath("/alljobs") },
      ],
    },
    {
      title: "Resume",
      url: "/resume/data",
      icon: <BotIcon />,
      isActive: isCurrentPath("/resume/data") || isCurrentPath("/resume/builder"),
      items: [
        { title: "Resume Data", url: "/resume/data", isActive: isCurrentPath("/resume/data") },
        { title: "Resume Builder", url: "/resume/builder", isActive: isCurrentPath("/resume/builder") },
      ],
    },
    {
      title: "Auto Apply With AI",
      url: "#",
      isActive: isCurrentPath("/auto-apply"),
      icon: <BrainCircuit />,
      items: [
        { title: "My Jobs", url: "/auto-apply/my-jobs", isActive: isCurrentPath("/auto-apply/my-jobs") },
        { title: "Any Job Link", url: "/auto-apply/any-job-link", isActive: isCurrentPath("/auto-apply/any-job-link") },
      ],
    },
    // {
    //   title: "Profile Settings",
    //   url: "#",
    //   isActive: isCurrentPath("/profile-settings"),
    //   icon: <UserRoundPen />,
    //   items: [
    //     { title: "General", url: "#", isActive: isCurrentPath("/profile-settings/general") }
    //   ],
    // },
    {
      title: "Plan & Billing",
      url: "/plan-billing",
      isActive: isCurrentPath("/plan-billing"),
      icon: <Receipt />,
      items: [
        { title: "Buy Credits", url: "/plan-billing", isActive: isCurrentPath("/plan-billing") },
        { title: "Billing Overview", url: "/plan-billing/general", isActive: isCurrentPath("/plan-billing/general") }
      ],
    },
  ],
}

export function AppSidebar({ userData, ...props }: React.ComponentProps<typeof Sidebar> & { userData: IUserResponse | null }) {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <Image src="/only_logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          {state !== "collapsed" && (
            <h3 className="ml-2 text-lg font-semibold text-base">Job Hunter</h3>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
