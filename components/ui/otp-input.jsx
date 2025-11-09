"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}) {
  const inputRefs = React.useRef([])

  const handleChange = (index, digit) => {
    if (disabled) return

    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, length)
    onChange(updatedValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    const digits = pastedData.replace(/\D/g, "").slice(0, length)
    onChange(digits)
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(digits.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-semibold"
          autoComplete="off"
        />
      ))}
    </div>
  )
}
