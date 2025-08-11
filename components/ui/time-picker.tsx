"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  className,
  disabled = false
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(value || "")

  React.useEffect(() => {
    if (value) {
      setSelectedTime(value)
    }
  }, [value])

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (onChange) {
      onChange(time)
    }
  }

  // Generate time options (24-hour format)
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        options.push(timeString)
      }
    }
    return options
  }, [])

  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-black/50 border border-gold/30 rounded-lg text-white hover:bg-black/70 hover:border-gold focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all",
            !selectedTime && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4 text-gold" />
          {formatDisplayTime(selectedTime)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border border-gold/30" align="start">
        <div className="max-h-60 overflow-y-auto p-2">
          <div className="grid grid-cols-3 gap-1">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-white hover:bg-gold/20 hover:text-gold transition-colors",
                  selectedTime === time && "bg-gold text-black hover:bg-gold"
                )}
                onClick={() => handleTimeSelect(time)}
              >
                {formatDisplayTime(time)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 