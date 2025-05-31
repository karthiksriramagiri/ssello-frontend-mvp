"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadCloud, FileText, Info, X, Download, ListTree, FileUp, Eye, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface BulkUploadModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

type Step = "type" | "upload" | "preview"

const Stepper = ({ currentStep }: { currentStep: Step }) => {
  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "type", label: "Type", icon: ListTree },
    { id: "upload", label: "Upload", icon: FileUp },
    { id: "preview", label: "Preview", icon: Eye },
  ]

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex flex-col items-center px-4 py-2 rounded-md transition-all duration-300",
              currentStep === step.id ? "bg-primary/10 text-primary" : "text-muted-foreground",
            )}
          >
            <step.icon
              className={cn("h-5 w-5 mb-1", currentStep === step.id ? "text-primary" : "text-muted-foreground")}
            />
            <span className={cn("text-xs font-medium", currentStep === step.id ? "text-primary" : "text-slate-500")}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2",
                steps.findIndex((s) => s.id === currentStep) > index ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function BulkUploadModal({ isOpen, onOpenChange }: BulkUploadModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("type")
  const [uploadTypeSelected, setUploadTypeSelected] = useState<"new-products" | "stock-price-update" | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name)
    } else {
      setFileName(null)
    }
  }

  const resetModal = () => {
    setCurrentStep("type")
    setFileName(null)
    setUploadTypeSelected(null) // Add this line
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">Bulk Upload Products</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Upload multiple products at once using UPC/ASIN codes.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1" onClick={resetModal}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Stepper currentStep={currentStep} />

          {currentStep === "type" && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-1">Select Upload Type</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose what you want to do with your bulk upload.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Card
                  className="w-full sm:max-w-xs cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
                  onClick={() => {
                    setUploadTypeSelected("new-products")
                    setCurrentStep("upload")
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="p-3 bg-blue-100 rounded-full mb-3">
                      <ListTree className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">Add New Products</p>
                    <p className="text-xs text-muted-foreground text-center">
                      Upload UPC/ASINs to find and list new products from the catalog.
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="w-full sm:max-w-xs cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
                  onClick={() => {
                    setUploadTypeSelected("stock-price-update")
                    setCurrentStep("upload")
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="p-3 bg-green-100 rounded-full mb-3">
                      <Edit className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">Update Stock/Price</p>
                    <p className="text-xs text-muted-foreground text-center">
                      Upload SKUs with new stock levels and prices for existing products.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === "upload" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {uploadTypeSelected === "stock-price-update"
                      ? "Upload Stock/Price Update File"
                      : "Upload New Products File"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {uploadTypeSelected === "stock-price-update"
                      ? "Upload a file with SKU, stock quantity, and price to update existing products."
                      : "Upload a file containing UPC or ASIN codes. Each code will be matched to the database."}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="bg-white">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download {uploadTypeSelected === "stock-price-update" ? "Update Template" : "New Product Template"}
                </Button>
              </div>

              {/* File upload area remains the same */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 bg-slate-50/50">
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                />
                <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                  {fileName ? (
                    <p className="text-sm font-medium text-primary">{fileName}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drag and drop your file here, or <span className="text-primary">click to browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Supports CSV and Excel files up to 10MB</p>
                    </>
                  )}
                </label>
              </div>

              <Alert
                className={cn(
                  "border text-sm",
                  uploadTypeSelected === "stock-price-update"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-blue-50 border-blue-200 text-blue-700",
                )}
              >
                <Info
                  className={cn(
                    "h-4 w-4",
                    uploadTypeSelected === "stock-price-update" ? "!text-green-600" : "!text-blue-600",
                  )}
                />
                <AlertTitle
                  className={cn(
                    "font-semibold",
                    uploadTypeSelected === "stock-price-update" ? "!text-green-800" : "!text-blue-800",
                  )}
                >
                  How it works:
                </AlertTitle>
                <AlertDescription
                  className={cn(
                    "text-xs",
                    uploadTypeSelected === "stock-price-update" ? "!text-green-700" : "!text-blue-700",
                  )}
                >
                  {uploadTypeSelected === "stock-price-update"
                    ? "Provide SKU, new quantity, and new price. Products must already exist in your inventory. Unmatched SKUs will be ignored."
                    : "Each UPC/ASIN will be automatically looked up in the database. The results will include product details, images, and attributes for listing."}
                </AlertDescription>
              </Alert>
              <div className="text-center mt-3">
                <span className="text-xs text-muted-foreground mr-2">Supported:</span>
                <FileText className="inline h-3 w-3 text-muted-foreground mr-0.5" />
                <span className="text-xs text-muted-foreground">.csv</span>
                <FileText className="inline h-3 w-3 text-muted-foreground ml-2 mr-0.5" />
                <span className="text-xs text-muted-foreground">.xlsx</span>
              </div>
            </div>
          )}

          {currentStep === "preview" && (
            <div className="text-center py-10">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Preview Uploaded Products</h3>
              <p className="text-sm text-muted-foreground">
                This is where you'll review your products before finalizing the upload.
              </p>
              {/* Placeholder for preview content */}
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-between">
          {currentStep !== "type" && (
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === "upload") {
                  setUploadTypeSelected(null) // Reset type when going back to type selection
                  setCurrentStep("type")
                } else if (currentStep === "preview") {
                  setCurrentStep("upload")
                }
              }}
              className="bg-white"
            >
              Back
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" onClick={resetModal}>
              Cancel
            </Button>
            {currentStep === "upload" && (
              <Button onClick={() => setCurrentStep("preview")} disabled={!fileName}>
                Next: Preview
              </Button>
            )}
            {currentStep === "preview" && (
              <Button>{uploadTypeSelected === "stock-price-update" ? "Upload Updates" : "Upload New Products"}</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
