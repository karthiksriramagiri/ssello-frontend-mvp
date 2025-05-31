"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Gauge, Settings, ArrowRight, Search, HelpCircle, BookOpen, MessageCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Guide {
  id: string
  title: string
  icon: React.ElementType
  gradient: string
  description: string
  faqs?: { question: string; answer: string }[]
  detailsLink?: string
}

const guides: Guide[] = [
  {
    id: "dashboard",
    title: "Getting Started: Dashboard Overview",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-indigo-500",
    description: "Understand the main dashboard sections, quick actions, and how to navigate your seller central.",
    faqs: [
      {
        question: "What are Quick Actions?",
        answer:
          "Quick Actions provide shortcuts to common tasks like adding products or checking orders directly from your dashboard.",
      },
      {
        question: "How do I check my onboarding progress?",
        answer:
          "The 'Complete Onboarding' section shows your progress. Click 'Finish Setup' to complete any pending steps.",
      },
    ],
  },
  {
    id: "products",
    title: "Managing Your Products",
    icon: Package,
    gradient: "from-green-500 to-emerald-500",
    description:
      "Learn how to add new products individually, use batch entry, upload in bulk, and edit existing listings.",
    faqs: [
      {
        question: "How do I add a single product?",
        answer:
          "Navigate to Products > Add New Item (Manual Entry) and fill in the product details, images, and shipping information.",
      },
      {
        question: "What is batch entry?",
        answer:
          "Batch entry allows you to quickly find and add products from the catalog using ASIN, UPC, or product titles before adding them to your inventory.",
      },
      {
        question: "How does bulk upload work?",
        answer:
          "You can download a template, fill it with your product UPCs/ASINs or SKU for stock/price updates, and upload the file via the Bulk Upload modal on the Products page.",
      },
    ],
  },
  {
    id: "orders",
    title: "Processing Orders",
    icon: ShoppingCart,
    gradient: "from-purple-500 to-pink-500",
    description:
      "A guide to viewing your orders, adding/editing tracking information, managing shipments, and handling cancellations.",
    faqs: [
      {
        question: "How do I add tracking to an order?",
        answer:
          "In the Orders table, find the order and click the 'Add Tracking' button or the edit icon next to existing tracking. Enter the tracking code and select the carrier.",
      },
      {
        question: "What happens when I cancel an order?",
        answer:
          "Cancelling an order requires a reason and may impact your Seller Pulse score. The order status will be updated to 'Cancelled'.",
      },
      {
        question: "How can I filter my orders?",
        answer:
          "Use the search bar and filter options at the top of the Orders page to filter by order ID, product, customer, status, or date range.",
      },
    ],
  },
  {
    id: "balance",
    title: "Understanding Your Balance",
    icon: DollarSign,
    gradient: "from-yellow-500 to-amber-500",
    description:
      "How to check your accumulated balance, understand sales, fees, cancellations, and view your report history.",
    faqs: [
      {
        question: "Where can I see my total balance?",
        answer:
          "The 'Accumulated balance' card on the Balance page shows your current estimated total, broken down by sales, cancellations, and fees.",
      },
      {
        question: "What is the minimum balance for payout?",
        answer: "You must reach a minimum accumulated balance of U$S 500 to receive payments.",
      },
    ],
  },
  {
    id: "seller-pulse",
    title: "Improving Your Seller Pulse",
    icon: Gauge,
    gradient: "from-orange-500 to-amber-500",
    description:
      "Learn about the Seller Pulse score, key performance factors like cancellations and problematic orders, and tips to improve your seller reputation.",
    faqs: [
      {
        question: "What affects my Seller Pulse score?",
        answer:
          "Key factors include order cancellation rate, delayed deliveries, and problematic orders. Each has a different weight on your overall score.",
      },
      {
        question: "How can I improve my score?",
        answer:
          "Focus on minimizing cancellations, ensuring timely shipments, and quickly resolving any order issues. Refer to the 'Learn More' links for specific tips on each metric.",
      },
    ],
  },
  {
    id: "account-settings",
    title: "Account Settings",
    icon: Settings,
    gradient: "from-cyan-500 to-teal-500",
    description:
      "Manage your profile, notification preferences, language settings, and other account-specific configurations.",
    faqs: [
      {
        question: "How do I change my profile information?",
        answer: "Click on your user icon in the top right header, then select 'Profile' from the dropdown menu.",
      },
      { question: "Can I change the language?", answer: "Yes, select 'Language' from the user menu in the header." },
    ],
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.faqs &&
        guide.faqs.some(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
        )),
  )

  return (
    <main className="flex-1 p-6 md:p-8 bg-gray-50/50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Help Center</h1>
          <p className="text-gray-600 text-lg">
            Find guides, FAQs, and answers to common questions about using the NocNoc Seller Central.
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-3 h-12 text-base bg-white border-gray-200 rounded-xl hover:border-blue-300 focus:border-blue-400 transition-all duration-200 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Chat Support</h3>
                  <p className="text-sm text-gray-600">Get instant help from our team</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Video Tutorials</h3>
                  <p className="text-sm text-gray-600">Step-by-step visual guides</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        </div>

        {filteredGuides.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", guide.gradient)} />
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 bg-gradient-to-br text-white rounded-xl shadow-lg flex-shrink-0", guide.gradient)}>
                      <guide.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{guide.title}</CardTitle>
                      <CardDescription className="mt-1 text-gray-600">{guide.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {guide.faqs && guide.faqs.length > 0 && (
                  <CardContent className="relative">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`faq-${guide.id}`} className="border-0">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline text-gray-700 hover:text-gray-900 py-3">
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            FAQs ({guide.faqs.length})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          <ul className="space-y-3">
                            {guide.faqs.map((faq, index) => (
                              <li key={index} className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-sm text-gray-900 mb-1">{faq.question}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {guide.detailsLink && (
                      <Button variant="ghost" asChild className="p-0 h-auto text-xs hover:bg-transparent group/btn mt-3">
                        <Link href={guide.detailsLink} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                          View Full Guide
                          <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-0 shadow-lg rounded-xl p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No Results Found</h3>
            <p className="text-gray-600 mt-2">
              We couldn&apos;t find any help articles matching &quot;{searchTerm}&quot;. Try a different search term.
            </p>
          </Card>
        )}

        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-lg">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Still need help?</h3>
                  <p className="text-gray-600 mt-1">Our support team is available 24/7 to assist you</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg shadow-lg shadow-orange-500/25">
                Contact Support
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
