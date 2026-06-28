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
import { TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon } from "lucide-react"
import Image from "next/image"
import { IUserResponse } from "@/interface/response/user.response"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Jobs",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: "All Jobs", url: "/alljobs" },
        // { title: "Starred", url: "#" },
        // { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Resume",
      url: "#",
      icon: <BotIcon />,
      items: [
        { title: "Resume Data", url: "/resume/data" },
        { title: "Resume Builder", url: "/resume/builder" },
      ],
    },
    {
      title: "Auto Apply",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
    {
      title: "Profile Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
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
