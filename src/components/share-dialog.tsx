'use client'

import { Button } from '@/components/ui/button'
import { Check, Copy, Share } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import WhatsApp from '@/components/logo/whatsapp'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

export default function ShareDialog() {

  const [copied, setCopied] = useState(false)
  const shareUrl = baseUrl

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying', error)
    }
  }

  async function handleWhatsAppShare() {
    const message = `Check out this Monash GPA Calculator: ${ shareUrl }`
    const whatsappUrl = `https://wa.me/?text=${ encodeURIComponent(message) }`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="hover:cursor-pointer">
          <Share/> Share
        </Button>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Share this Calculator</DialogTitle>
          <DialogDescription>
            Try out this calculator with your friends and classmates! 💅
          </DialogDescription>
        </DialogHeader>

        {/* Copy Link */ }
        <div className="space-y-2 mt-3">
          <Label htmlFor="share-url">Share Link</Label>
          <div className="flex space-x-2">
            <Input id="share-url" value={ shareUrl } readOnly className="flex-1"/>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={ handleCopy }>
                    { copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/> }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{ copied ? 'Copied!' : 'Copy link' }</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          { copied && <p className="text-xs text-green-600">Link copied to clipboard!</p> }
        </div>

        {/* Divider */ }
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or share via
          </span>
        </div>

        {/* Share Options */ }
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={ handleWhatsAppShare }
            className="w-full"
          >
            <WhatsApp/> WhatsApp
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
