"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BookOpen, Settings, Plus, Box, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { categories, selectedCategory, setSelectedCategory, setIsAdmin } = useAppStore();

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Learn Together</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Parent & Child Learning</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase px-2 py-2">
            Categories
          </h2>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                onNavigate?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                selectedCategory?.id === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <span className="text-xl">{category.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{category.name}</p>
                <p className="text-xs opacity-70 truncate">{category.description}</p>
              </div>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                {category.topics.length}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <Link href="/lessons" className="block" onClick={onNavigate}>
          <Button variant="outline" className="w-full" size="sm">
            <Box className="h-4 w-4 mr-2" />
            3D 交互课程
          </Button>
        </Link>
        <Button variant="outline" className="w-full" size="sm" onClick={onNavigate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          size="sm"
          onClick={() => {
            setIsAdmin(true);
            onNavigate?.();
          }}
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex w-64 border-r bg-card flex-col h-full">
        <SidebarContent />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b p-2 flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold">Learn Together</span>
        </div>
      </div>
    </>
  );
}
