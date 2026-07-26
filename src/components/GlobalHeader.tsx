"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface GlobalHeaderProps {
  title: string
  description?: string
  buttonText?: string
  buttonHref?: string
  buttonOnClick?: () => void
  className?: string
}

export default function GlobalHeader({
  title,
  description,
  buttonText,
  buttonHref,
  buttonOnClick,
  className = "",
}: GlobalHeaderProps) {
  return (
    <div className={`mx-auto flex flex-col items-center container space-y-5 text-center ${className}`}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-display text-4xl text-ink md:text-6xl"
      >
        {title}
      </motion.h2>

      {description && (
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}

      {buttonText && (
        <div className="pt-2">
          {buttonHref ? (
            <Button variant="outline" size="lg" className="border-line text-ink hover:border-primary hover:text-primary" asChild>
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={buttonOnClick}
              className="border-line text-ink hover:border-primary hover:text-primary"
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function HeaderThree({ title }: GlobalHeaderProps) {
  return (
    <div className="my-6 flex items-center gap-3 sm:my-10">
      <span className="h-px w-8 bg-marigold" />
      <h3 className="font-display text-2xl text-ink md:text-4xl">{title}</h3>
    </div>
  )
}
