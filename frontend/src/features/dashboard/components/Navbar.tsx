// src/features/dashboard/DashboardNavbar.tsx

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { Bell, ChevronDown, Gift, LayoutDashboard, Plus } from "lucide-react"; // Import necessary icons

export default function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Left Section: Logo and Workspace Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Logo/Icon Button (mimics the image) */}
        <Button variant="ghost" size="icon" className="w-10 h-10 bg-orange-500 hover:bg-orange-600">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </Button>

        {/* Workspace Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 pr-2">
              <span className="font-semibold">Shashwat's</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>My Workspace</DropdownMenuItem>
            <DropdownMenuItem>Team Workspace</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section: Pro, Notifications, User */}
      <div className="flex items-center space-x-4">
        {/* Trial Info */}
        <span className="text-sm text-gray-600 hidden sm:inline">2-day free trial</span>

        {/* Buy PRO Button */}
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md flex items-center gap-2">
          <Plus className="h-4 w-4" /> Buy PRO
        </Button>

        {/* Gift Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Gift className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white"></span> {/* Red dot */}
        </Button>

        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white"></span> {/* Red dot */}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm hidden sm:inline">Hi, Shashwat S</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" /> {/* Replace with actual image */}
                <AvatarFallback className="bg-purple-300 text-purple-800">SS</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}