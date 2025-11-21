"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-cyan-600 hover:bg-cyan-700 text-white"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* AI Assistant Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-600" />
              AI Assistant
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">
              Get instant help with your academic questions, study materials, and general queries.
            </p>

            <Link href="/chat" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Open Full Chat</Button>
            </Link>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">Quick Actions:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs bg-transparent">
                  Help with Math Problems
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs bg-transparent">
                  Programming Questions
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs bg-transparent">
                  Study Tips & Strategies
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
