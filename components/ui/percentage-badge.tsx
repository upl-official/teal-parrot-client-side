import { Badge, type BadgeProps } from "./badge"

interface PercentageBadgeProps extends Omit<BadgeProps, "children"> {
  value: number
  suffix?: string
  prefix?: string
}

export function PercentageBadge({ value, suffix = "%", prefix = "", ...props }: PercentageBadgeProps) {
  // Round the percentage value to the nearest integer
  const roundedValue = Math.round(value)

  return (
    <Badge {...props}>
      {prefix}
      {roundedValue}
      {suffix}
    </Badge>
  )
}
