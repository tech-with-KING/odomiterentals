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
    <div className={`space-y-6 ${className}`}>
      {/* Animated Title */}
      <motion.span
        whileHover="whileHover"
        variants={{
          initial: { x: 0 },
          whileHover: { x: -16 },
        }}
        transition={{
          type: "spring",
          staggerChildren: 0.075,
          delayChildren: 0.25,
        }}
        className="relative z-10 block text-4xl font-bold text-gray-700 transition-colors duration-500 hover:text-gray-500 md:text-6xl"
      >
        {title.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { x: 0 },
              whileHover: { x: 16 },
            }}
            transition={{ type: "spring" }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </motion.span>

      {/* Optional Description */}
      {description && <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{description}</p>}

      {/* Optional Button */}
      {buttonText && (
        <div className="pt-2">
          {buttonHref ? (
            <Link href={buttonHref}>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={buttonOnClick}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function HeaderThree({
  title,
}: GlobalHeaderProps) {
  return (
    <div className={`my-6  sm:my-10 `}>
      {/* Animated Title */}
      <motion.span
        whileHover="whileHover"
        variants={{
          initial: { x: 0 },
          whileHover: { x: -16 },
        }}
        transition={{
          type: "spring",
          staggerChildren: 0.075,
          delayChildren: 0.25,
        }}
        className="relative z-10 block text-2xl font-bold text-gray-500 transition-colors duration-500 hover:text-gray-600 md:text-4xl"
      >
        {title.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { x: 0 },
              whileHover: { x: 16 },
            }}
            transition={{ type: "spring" }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </motion.span>
    </div>
  )
}
