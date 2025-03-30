"use client"

import { Toaster as Sonner } from "sonner"

function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner 
      theme="system"
      position="top-right"
      className="toaster"
      toastOptions={{
        classNames: {
          toast: "group border-border bg-background text-foreground",
          title: "text-foreground font-semibold", 
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "text-foreground/50 hover:text-foreground"
        }
      }}
      {...props}
    />
  )
}

export { Toaster }