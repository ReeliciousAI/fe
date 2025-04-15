import { SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { CreditCard, LogOut, User } from "lucide-react";


export default function UserButton() {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size={"lg"}>
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt="User profile image" />
            <AvatarFallback>
              {user?.firstName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate text-sm text-stone-700 max-w-[150px]">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        sideOffset={5}
        align="end"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem>
          <User />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          <span>Billing</span>
        </DropdownMenuItem>
        <SignOutButton>
          <DropdownMenuItem>
            <LogOut />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
