"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AutoCompleteProps {
  options: { value: string; label: string }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function AutoComplete({
  options,
  value,
  onChange,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Update the input value when the value prop changes
  useEffect(() => {
    if (value) {
      const selectedOption = options.find((option) => option.value === value)
      setInputValue(selectedOption?.label || "")
    } else {
      setInputValue("")
    }
  }, [value, options])

  // Filter options based on input value
  const filteredOptions =
    inputValue === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(inputValue.toLowerCase())
        })

  return (
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
              // Don't close the popover when typing
              if (!open) setOpen(true)
            }}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={placeholder}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredOptions.length > 0) {
                onChange(filteredOptions[0].value)
                setOpen(false)
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
                    onChange(option.value)
                    setInputValue(option.label)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
