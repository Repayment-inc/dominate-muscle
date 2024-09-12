"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";

import {
  // Home,
  PanelLeft,
  Folder,
  // Users,
  User2,
} from "lucide-react";
import { useRouter } from 'next/navigation';

// import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import { useLogout } from '@/lib/auth';
import { useAuth } from "@/hooks/use-auth";
// import { ROLES, useAuthorization } from "@/lib/authorization
import { cn } from "@/lib/utils";
import Image from "next/image";
import logoSrc from '@/app/assets/images/hero-logo.png';

import { GiMuscleUp } from "react-icons/gi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  //   const { checkAccess } = useAuthorization();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  

  const navigation = [
    { name: "ダッシュボード", to: "./dashboard", icon: Folder },
    { name: "<トレーニング開始>", to: "./workout", icon: GiMuscleUp },
    // { name: 'Discussions', to: './discussions', icon: Folder },
    { name: "履歴", to: "./history", icon: Folder },
    { name: "エクササイズ一覧", to: "./exercise", icon: Folder },
    // checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
    //   name: 'Users',
    //   to: './users',
    //   icon: Users,
    // },
  ].filter(Boolean) as SideNavigationItem[];

    // リンクをクリックしたときにDrawerを閉じる関数
    const handleLinkClick = () => {
      setIsDrawerOpen(false);
    };

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Web用UI */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-black sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <div className="flex h-16 shrink-0 items-center px-4">
            {/* <Logo /> */}
            <div className="flex items-center">
                <Image
                  src={logoSrc}
                  alt="Dominate Muscle Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-white text-xl font-bold">dominate-muscle</span>
              </div>
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.to}
              className={cn(
                "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium",
                )
              }
            >
              <item.icon
                className={cn(
                  "text-gray-400 group-hover:text-gray-300",
                  "mr-4 size-6 shrink-0",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* スマホ用UI */}
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="size-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent
                side="left"
                className="bg-black pt-10 text-white sm:max-w-60"
              >
                <nav className="grid gap-6 text-lg font-medium">
                  <div className="flex h-16 shrink-0 items-center px-4">
                    {/* <Logo /> */}
                  </div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.to}
                      className={cn(
                        "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium",
                      )}
                      onClick={handleLinkClick}
                    >
                      <item.icon
                        className={cn(
                          "text-gray-400 group-hover:text-gray-300",
                          "mr-4 size-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <span className="sr-only">Open user menu</span>
                <User2 className="size-6 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className={cn("block px-4 py-2 text-sm text-gray-700")}
              >
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn("block px-4 py-2 text-sm text-gray-700 w-full")}
                onClick={() => logout()}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
