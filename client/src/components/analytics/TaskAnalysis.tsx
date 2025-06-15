
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Task } from "@/types/types"

interface TaskAnalysisProps {
  tasks : Task[]
}

const chartConfig = {
  low: {
    label: "Low Priority",
    color: "var(--chart-low)",
  },
  medium: {
    label: "Medium Priority",
    color: "var(--chart-medium)",
  },
  high: {
    label: "High Priority",
    color: "var(--chart-high)",
  },
} satisfies ChartConfig;

export function TaskAnalysis( { tasks } : TaskAnalysisProps ) {

  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  const priorities = ["low", "medium", "high"];

  const chartData = statuses.map((status) => {
    const dataForStatus = tasks.filter((task) => task.status === status);

    return {
      status,
      ...priorities.reduce((acc, priority) => {
        acc[priority] = dataForStatus.filter(
          (task) => task.priority?.toLowerCase() === priority
        ).length;
        return acc;
      }, {} as Record<string, number>),
    };
  });


  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="status"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.replace("_", " ")}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="low" stackId="a" fill="var(--chart-low)" />
        <Bar dataKey="medium" stackId="a" fill="var(--chart-medium)" />
        <Bar dataKey="high" stackId="a" fill="var(--chart-high)" />
      </BarChart>
    </ChartContainer>
  )
}
