"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Input } from "./input";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from "./avatar";


export default function Navigation() {

  const router = useRouter();

  async function clickCreateTodo() {
    router.push("/create-todo");
  }

  async function clickLogout() {
    try {
      await axios.get("https://mysterious-sada-tomfletcher-e440737c.koyeb.app/logout", {
        withCredentials: true,
      });
      router.push("/")
    } catch (err) {
      console.error("error logging out:", err)
    }
  };

  return (
    <div className="flex w-screen pl-4 pt-4 pb-4 justify-center">
      <NavigationMenu className="gap-3">
        <NavigationMenuList>
          <NavigationMenuItem>
            <p className="logo font-light">TODO</p>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Input placeholder="Search for something..."></Input>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger><Avatar><AvatarFallback>AC</AvatarFallback></Avatar></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clickCreateTodo}>Create Todo</DropdownMenuItem>
                <DropdownMenuItem onClick={clickLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}