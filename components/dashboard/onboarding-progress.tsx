"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Rocket, CircleDashed } from "lucide-react"

export function OnboardingProgress() {
  const steps = [
    { title: "Account Created", isCompleted: true },
    { title: "Products Uploaded", isCompleted: true },
    { title: "Link Bank Account", isCompleted: false },
    { title: "Upload Documents", isCompleted: false },
  ]

  const completedSteps = steps.filter((step) => step.isCompleted).length
  const progressValue = (completedSteps / steps.length) * 100
  const allStepsCompleted = completedSteps === steps.length

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-2 flex-shrink-0">
        {allStepsCompleted ? (
          <Rocket className="h-5 w-5 text-green-500" />
        ) : (
          <CircleDashed className="h-5 w-5 text-muted-foreground" />
        )}
        <h2 className="text-sm font-medium text-foreground whitespace-nowrap">
          {allStepsCompleted ? "Onboarding Complete!" : "Complete Onboarding"}
        </h2>
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <Progress value={progressValue} className="h-2 bg-orange-100" indicatorClassName="bg-primary" />
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
        {completedSteps}/{steps.length} Steps Done
      </div>
      {!allStepsCompleted && (
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-3 whitespace-nowrap flex-shrink-0"
        >
          Finish Setup
        </Button>
      )}
    </div>
  )
}
