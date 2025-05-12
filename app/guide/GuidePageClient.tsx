"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SizeGuide } from "@/components/guide/size-guide"
import { CareGuide } from "@/components/guide/care-guide"
import { PageTransition } from "@/components/animated/page-transition"
import { motion } from "framer-motion"
import { Ruler, Sparkles } from "lucide-react"

export default function GuidePageClient() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-teal-600 to-teal-500 py-16 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
              <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-10 right-1/4 h-32 w-32 rounded-full bg-white/5"></div>
            </div>
            <div className="container relative mx-auto px-4 text-center">
              <motion.h1
                className="mb-4 text-3xl md:text-4xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Size & Care Guide
              </motion.h1>
              <motion.p
                className="mx-auto max-w-2xl text-lg text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Everything you need to know about finding the perfect fit and keeping your silver jewelry looking
                beautiful for years to come.
              </motion.p>
            </div>
          </section>

          {/* Main Content */}
          <section className="container mx-auto px-4 py-12">
            <Tabs defaultValue="size" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="size" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span>Size Guide</span>
                  </TabsTrigger>
                  <TabsTrigger value="care" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Care Guide</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="size">
                <SizeGuide />
              </TabsContent>

              <TabsContent value="care">
                <CareGuide />
              </TabsContent>
            </Tabs>
          </section>
        </div>
        <Footer />
      </main>
    </PageTransition>
  )
}
