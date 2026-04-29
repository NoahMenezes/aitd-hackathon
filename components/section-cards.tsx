"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-white/40 border-white/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wider font-semibold">Total Revenue</CardDescription>
          <CardTitle className="text-3xl font-display font-semibold tabular-nums tracking-tight">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Current monthly trend
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/40 border-white/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wider font-semibold">New Customers</CardDescription>
          <CardTitle className="text-3xl font-display font-semibold tabular-nums tracking-tight">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
              <TrendingDownIcon />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Compared to last month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/40 border-white/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wider font-semibold">Active Accounts</CardDescription>
          <CardTitle className="text-3xl font-display font-semibold tabular-nums tracking-tight">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">User retention rate</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/40 border-white/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wider font-semibold">Growth Rate</CardDescription>
          <CardTitle className="text-3xl font-display font-semibold tabular-nums tracking-tight">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">Annual growth projection</div>
        </CardFooter>
      </Card>
    </div>
  )
}
