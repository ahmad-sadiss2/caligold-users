"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  className,
  disabled = false,
  minDate = new Date()
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value))
    }
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      onChange(format(selectedDate, "yyyy-MM-dd"))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-black/50 border border-gold/30 rounded-lg text-white hover:bg-black/70 hover:border-gold focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all",
            !date && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
          {date ? format(date, "PPP", { locale: enUS }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border border-gold/30" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => date < minDate}
          initialFocus
          className="bg-black text-white"
          locale={enUS}
        />
      </PopoverContent>
    </Popover>
  )
} 