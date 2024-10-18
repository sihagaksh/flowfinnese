"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
    { name: "Templates", href: "/templates" },
    { name: "Docs", href: "/docs" },
    { name: "Discord", href: "/discord" },
  ]

  return (
    <motion.header
      className="bg-white border-b border-gray-200"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="text-2xl font-bold text-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/">Flow Finesse</Link>
          </motion.div>

          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="hidden md:flex space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="text-sm font-medium">
                Create Account
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium">
                Sign In
              </Button>
            </motion.div>
          </div>

          <motion.button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>

        <motion.div
          className={`md:hidden overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{ maxHeight: isOpen ? 400 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full text-sm font-medium">
                Create Account
              </Button>
              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium">
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}