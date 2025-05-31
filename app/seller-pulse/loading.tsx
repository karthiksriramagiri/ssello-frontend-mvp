import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PackageX, Clock, ShieldAlert } from "lucide-react"

export default function SellerPulseLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 bg-muted/40">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" /> {/* Title Skeleton */}
        <div className="w-full sm:w-auto max-w-xs">
          <Card className="shadow-md rounded-lg flex flex-col aspect-square p-0 overflow-hidden border bg-slate-50 border-slate-100">
            <CardHeader className="pt-2.5 px-3 pb-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-2 pt-0.5">
              <Skeleton className="h-[50px] w-[100px] rounded-full mb-1" /> {/* Gauge Skeleton */}
              <Skeleton className="h-4 w-20" /> {/* Status Text Skeleton */}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-1" /> {/* Performance Factors Title */}
          <Skeleton className="h-4 w-2/3" /> {/* Performance Factors Description */}
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {[
            { icon: PackageX, color: "text-red-500" },
            { icon: Clock, color: "text-amber-500" },
            { icon: ShieldAlert, color: "text-purple-500" },
          ].map((metric, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-6 w-6 ${metric.color} opacity-50`} />
                    <Skeleton className="h-6 w-32" /> {/* Metric Title */}
                  </div>
                  <Skeleton className="h-5 w-16" /> {/* Metric Weight */}
                </div>
                <Skeleton className="h-4 w-full mt-1" /> {/* Metric Current/Target */}
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <Skeleton className="h-2.5 w-full" /> {/* Progress Bar */}
                <Skeleton className="h-5 w-24" /> {/* Status Text */}
                <Skeleton className="h-4 w-full" /> {/* Description Line 1 */}
                <Skeleton className="h-4 w-5/6" /> {/* Description Line 2 */}
              </CardContent>
              <div className="p-4 pt-0">
                <Skeleton className="h-5 w-24" /> {/* Learn More Link */}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" /> {/* Understanding Score Title */}
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-start gap-2 pt-2">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
