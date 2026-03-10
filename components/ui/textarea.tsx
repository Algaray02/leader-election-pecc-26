import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-[#D4AF37]/40 bg-white text-[#4A0E17] px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-[#6B4F43]/40 focus-visible:border-[#D4AF37] focus-visible:ring-[3px] focus-visible:ring-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
