"use client"

import * as React from "react"
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts"
import { cn } from "@/lib/utils"

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name: string
    value: number
  }[]
  areaClassName?: string
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  yAxisWidth?: number
  strokeWidth?: number
  gradient?: boolean
  height?: number
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  ({ 
    data, 
    areaClassName, 
    showXAxis = true, 
    showYAxis = true, 
    showGrid = true, 
    showTooltip = true, 
    yAxisWidth = 40, 
    strokeWidth = 2, 
    gradient = true, 
    height = 300, 
    className, 
    ...props 
  }, ref) => {
    const id = React.useId()

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            {gradient && (
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}
            {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-1))"
              strokeWidth={strokeWidth}
              fill={gradient ? `url(#gradient-${id})` : "hsl(var(--chart-1))"}
              className={areaClassName}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
AreaChart.displayName = "AreaChart"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export { AreaChart }