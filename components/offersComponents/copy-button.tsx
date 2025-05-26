"use client"

import { useState } from "react"
import { Button } from "@mui/material"
import { Copy, Check } from "lucide-react"

interface CopyButtonProps {
  code: string
}

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleCopy}
      startIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      className={`min-w-[100px] ${
        copied
          ? "border-green-500 text-green-600 hover:border-green-600"
          : "border-orange-500 text-orange-600 hover:border-orange-600"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  )
}
