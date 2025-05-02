"use client"

import * as React from "react"
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LabelList
} from "recharts"
import { cn } from "@/lib/utils"

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name: string
    value: number
  }[]
  barClassName?: string
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  yAxisWidth?: number
  strokeWidth?: number
  layout?: "horizontal" | "vertical"
  height?: number
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({ 
    data, 
    barClassName, 
    showXAxis = true, 
    showYAxis = true, 
    showGrid = true, 
    showTooltip = true, 
    yAxisWidth = 40, 
    strokeWidth = 2, 
    layout = "horizontal",
    height = 300, 
    className, 
    ...props 
  }, ref) => {
    const id = React.useId()
    const isVertical = layout === "vertical"

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 10,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={!isVertical} horizontal={isVertical} />}
            
            {showXAxis && (
              <XAxis 
                dataKey={isVertical ? undefined : "name"} 
                type={isVertical ? "number" : "category"} 
                tickLine={false} 
                axisLine={false}
                hide={isVertical}
              />
            )}
            
            {showYAxis && (
              <YAxis 
                dataKey={isVertical ? "name" : undefined}
                type={isVertical ? "category" : "number"}
                width={yAxisWidth} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={isVertical ? (value) => value.slice(0, 3) : undefined}
              />
            )}
            
            {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
            
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"  // Changed from --chart-1 to --primary (green)
              radius={4}
              className={barClassName}
            >
              {isVertical && (
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
              )}
              <LabelList
                dataKey="value"
                position={isVertical ? "right" : "top"}
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
BarChart.displayName = "BarChart"

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

export { BarChart }