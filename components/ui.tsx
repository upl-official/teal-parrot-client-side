// Re-export all UI components from their individual files
export { Button } from "./ui/button"
export { Input } from "./ui/input"
export { Label } from "./ui/label"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
export { RadioGroup, RadioGroupItem } from "./ui/radio-group"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
export { Badge } from "./ui/badge"
export { Alert, AlertDescription, AlertTitle } from "./ui/alert"
export { Separator } from "./ui/separator"
export { Switch } from "./ui/switch"
export { Textarea } from "./ui/textarea"
export { Slider } from "./ui/slider"
export { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

// Create a basic Select component since it's missing
import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

export { Select }
