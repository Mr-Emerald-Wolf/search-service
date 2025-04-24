"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MultiAutoCompleteProps {
  options: { value: string; label: string }[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function MultiAutoComplete({
  options,
  values = [],
  onChange,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
}: MultiAutoCompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on input value and already selected values
  const filteredOptions =
    inputValue === ""
      ? options.filter((option) => !values.includes(option.value))
      : options.filter((option) => {
          return option.label.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(option.value)
        })

  const handleSelect = (value: string) => {
    onChange([...values, value])
    setInputValue("")
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter((value) => value !== valueToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-1">
        {values.map((value) => {
          const option = options.find((opt) => opt.value === value)
          return (
            <Badge key={value} variant="secondary" className="flex items-center gap-1">
              {option?.label || value}
              <button
                type="button"
                className="rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                onClick={() => handleRemove(value)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {option?.label || value}</span>
              </button>
            </Badge>
          )
        })}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                if (!open) setOpen(true)
              }}
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={values.length > 0 ? "" : placeholder}
              onClick={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredOptions.length > 0) {
                  handleSelect(filteredOptions[0].value)
                }
              }}
            />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <Command>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      handleSelect(option.value)
                      setOpen(true) // Keep open for multiple selections
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", values.includes(option.value) ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
