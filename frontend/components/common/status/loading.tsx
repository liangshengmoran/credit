"use client"

import { motion, AnimatePresence } from "motion/react"
import { Badge } from "@/components/ui/badge"
export function LoadingPage() {



  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-4"
        >
          <div className="relative inline-block text-3xl sm:text-4xl md:text-5xl font-bold text-foreground dark:text-white leading-tight">
            LINUX DO{" "}
            <span className="relative">
              <span className="text-3xl sm:text-4xl md:text-5xl italic font-serif text-blue-600 dark:text-blue-400">
                PAY
              </span>
              <span className="absolute -top-4 md:-top-6 -right-10">
                <Badge variant="outline" className="text-[10px] px-1 h-4">商户</Badge>
              </span>
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="text-xs sm:text-sm md:text-base text-muted-foreground dark:text-neutral-400"
          >
            <span>正在初始化商户系统...</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
