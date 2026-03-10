"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!font-sans !border-2 !shadow-xl !shadow-primary/10 !rounded-2xl !p-4 !gap-3",
          title: "!text-base !font-bold",
          description: "!font-semibold !text-sm !opacity-90 !text-gray-600",
          success: "!bg-emerald-50 !text-emerald-600 !border-emerald-300",
          error: "!bg-red-50 !text-red-600 !border-red-300",
          warning: "!bg-yellow-50 !text-yellow-600 !border-yellow-300",
          info: "!bg-blue-50 !text-blue-600 !border-blue-300",
          actionButton: "!bg-primary !text-white !font-bold !rounded-xl",
          cancelButton: "!bg-slate-100 !text-slate-600 !font-bold !rounded-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
