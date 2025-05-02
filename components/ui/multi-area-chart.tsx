"use client"

import * as React from "react"
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from "recharts"
import { cn } from "@/lib/utils"

interface MultiAreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  series: {
    name: string
    dataKey: string
    color: string
  }[]
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  yAxisWidth?: number
  strokeWidth?: number
  gradient?: boolean
  height?: number
}

const MultiAreaChart = React.forwardRef<HTMLDivElement, MultiAreaChartProps>(
  ({ 
    data, 
    series,
    showXAxis = true, 
    showYAxis = true, 
    showGrid = true, 
    showTooltip = true,
    showLegend = true,
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
            {gradient && series.map((serie, index) => (
              <defs key={`gradient-${index}`}>
                <linearGradient id={`gradient-${id}-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={serie.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={serie.color} stopOpacity={0} />
                </linearGradient>
              </defs>
            ))}
            {showXAxis && <XAxis dataKey="name" tickLine={false} axisLine={false} />}
            {showYAxis && <YAxis width={yAxisWidth} tickLine={false} axisLine={false} />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            
            {series.map((serie, index) => (
              <Area
                key={serie.dataKey}
                type="monotone"
                dataKey={serie.dataKey}
                name={serie.name}
                stroke={serie.color}
                strokeWidth={strokeWidth}
                fill={gradient ? `url(#gradient-${id}-${index})` : serie.color}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
MultiAreaChart.displayName = "MultiAreaChart"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-[0.70rem] uppercase text-muted-foreground mb-1">
          {label}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-muted-foreground">{entry.name}: </span>
            <span className="font-bold text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export { MultiAreaChart }