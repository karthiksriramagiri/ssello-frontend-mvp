"use client"

import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"

interface NotificationProps {
  title: string
  message: string
  isNew?: boolean
}

export function Notification({ title, message, isNew = false }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <Alert className="relative bg-secondary border-orange-200 border-l-4 border-l-primary p-3 rounded-lg">
      {isNew && (
        <div className="absolute -top-1.5 -left-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
          NEW
        </div>
      )}
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
        <div className="flex-1">
          <AlertTitle className="text-sm font-semibold text-orange-700">{title}</AlertTitle>
          <AlertDescription className="text-xs text-orange-600 leading-tight">{message}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-6 w-6 text-orange-500 hover:text-orange-700 hover:bg-orange-100 flex-shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </Alert>
  )
}
