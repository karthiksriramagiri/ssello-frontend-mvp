"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Landmark, AlertTriangle, CircleHelp, ArrowUpRight } from "lucide-react"

export default function BalanceLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 bg-muted/40">
      <div className="flex items-center">
        <Skeleton className="h-8 w-32" />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CircleHelp className="h-5 w-5 text-muted-foreground" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
            <hr className="my-2 border-dashed" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Card className="bg-amber-50 border-amber-300">
          <CardHeader className="flex flex-row items-start gap-2 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <Skeleton className="h-5 w-24 mb-1.5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {[...Array(9)].map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-5 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <Skeleton className="h-5 w-48 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex items-center justify-between border-t p-4">
            <Skeleton className="h-5 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-[70px]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
