"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Activity,
  Camera,
  FileText,
  User,
  Car,
  Calendar,
  Edit3,
  Info,
  Plus,
  Download,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DamageAssessment {
  type: string
  severity: "Minor" | "Moderate" | "Major" | "Severe"
  confidence: number
  edited: boolean
}

type ClaimStatus = "UNDER_REVIEW" | "PENDING" | "APPROVED" | "CLOSED"

interface StatusHistory {
  status: ClaimStatus
  timestamp: Date
  message: string
}

interface AuditLogEntry {
  timestamp: Date
  action: string
  user: string
  aiUsed: boolean
  details: string
}

export function ClaimsAgentDashboard() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(true)
  const [estimatedCost, setEstimatedCost] = useState({ min: 2800, max: 3500 })
  const [agentNotes, setAgentNotes] = useState("")
  const [finalEstimate, setFinalEstimate] = useState("3150")
  const [damageResults, setDamageResults] = useState<DamageAssessment[]>([
    { type: "Front Bumper Damage", severity: "Moderate", confidence: 94, edited: false },
    { type: "Hood Dent", severity: "Minor", confidence: 87, edited: false },
    { type: "Headlight Crack", severity: "Major", confidence: 96, edited: false },
    { type: "Paint Scratches", severity: "Minor", confidence: 91, edited: false },
  ])
  const [overallConfidence, setOverallConfidence] = useState(92)
  const [hasAIFeedback, setHasAIFeedback] = useState(false)
  const [assessmentTimestamp, setAssessmentTimestamp] = useState<string>("")

  const [currentStatus, setCurrentStatus] = useState<ClaimStatus>("UNDER_REVIEW")
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([
    {
      status: "UNDER_REVIEW",
      timestamp: new Date(),
      message: "Assessment in progress - claim under initial review by agent",
    },
  ])
  const [showStatusMessage, setShowStatusMessage] = useState(false)
  const [latestStatusMessage, setLatestStatusMessage] = useState("")

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      timestamp: new Date(Date.now() - 5 * 60000),
      action: "Automated Assessment Generated",
      user: "System",
      aiUsed: true,
      details: "Automated damage assessment completed with 92% confidence",
    },
    {
      timestamp: new Date(Date.now() - 3 * 60000),
      action: "Claim Opened",
      user: "Agent A-4782",
      aiUsed: false,
      details: "Claim POL-2024-8847392 assigned for review",
    },
  ])

  useEffect(() => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    setAssessmentTimestamp(timestamp)
  }, [])

  const changeStatus = (newStatus: ClaimStatus) => {
    let message = ""

    switch (newStatus) {
      case "UNDER_REVIEW":
        message = "Assessment in progress - claim under initial review by agent"
        break
      case "PENDING":
        message = "Claim submitted for approval - awaiting adjuster review"
        break
      case "APPROVED":
        message = "Claim approved by adjuster - repair authorization being prepared"
        break
      case "CLOSED":
        message = "Repair Authorization sent to policyholder - claim processing complete"
        break
    }

    setCurrentStatus(newStatus)
    const newHistoryEntry: StatusHistory = {
      status: newStatus,
      timestamp: new Date(),
      message,
    }
    setStatusHistory([...statusHistory, newHistoryEntry])
    setLatestStatusMessage(message)
    setShowStatusMessage(true)

    const auditEntry: AuditLogEntry = {
      timestamp: new Date(),
      action: `Status Changed to ${newStatus}`,
      user: "Agent A-4782",
      aiUsed: false,
      details: message,
    }
    setAuditLog([auditEntry, ...auditLog])

    // Auto-hide message after 5 seconds
    setTimeout(() => setShowStatusMessage(false), 5000)
  }

  const handleSubmitForApproval = () => {
    changeStatus("PENDING")

    // Automatically progress to APPROVED after 3 seconds
    setTimeout(() => {
      changeStatus("APPROVED")

      // Automatically progress to CLOSED after another 3 seconds
      setTimeout(() => {
        changeStatus("CLOSED")
      }, 3000)
    }, 3000)
  }

  const handleApprove = () => {
    changeStatus("APPROVED")
  }

  const handleSendRA = () => {
    changeStatus("CLOSED")
  }

  const handleDownloadRA = () => {
    // Simulate PDF download
    const pdfContent = `
Repair Authorization
Policy: POL-2024-8847392
Policyholder: Sarah Mitchell
Vehicle: 2022 Honda Accord
Approved Amount: $${finalEstimate}
Authorization Date: ${new Date().toLocaleDateString()}
    `
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `RA_POL-2024-8847392.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const auditEntry: AuditLogEntry = {
      timestamp: new Date(),
      action: "RA Downloaded",
      user: "Agent A-4782",
      aiUsed: false,
      details: "Repair Authorization document downloaded",
    }
    setAuditLog([auditEntry, ...auditLog])
  }

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case "UNDER_REVIEW":
        return {
          variant: "secondary" as const,
          label: "Under Review",
          className: "bg-blue-500/20 text-blue-500 border-blue-500/30 font-semibold px-3 py-1.5 text-sm",
        }
      case "PENDING":
        return {
          variant: "secondary" as const,
          label: "Pending Approval",
          className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-semibold px-3 py-1.5 text-sm",
        }
      case "APPROVED":
        return {
          variant: "default" as const,
          label: "Approved",
          className: "bg-green-500/20 text-green-500 border-green-500/30 font-semibold px-3 py-1.5 text-sm",
        }
      case "CLOSED":
        return {
          variant: "outline" as const,
          label: "Closed",
          className: "bg-slate-500/20 text-slate-400 border-slate-500/30 font-semibold px-3 py-1.5 text-sm",
        }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...newImages])
      handleRerunAssessment()
    }
  }

  const handleRerunAssessment = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
      const now = new Date()
      const timestamp = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      setAssessmentTimestamp(timestamp)
      setDamageResults([
        { type: "Front Bumper Damage", severity: "Moderate", confidence: 94, edited: false },
        { type: "Hood Dent", severity: "Minor", confidence: 87, edited: false },
        { type: "Headlight Crack", severity: "Major", confidence: 96, edited: false },
        { type: "Paint Scratches", severity: "Minor", confidence: 91, edited: false },
      ])
      setHasAIFeedback(false)

      const auditEntry: AuditLogEntry = {
        timestamp: new Date(),
        action: "Automated Assessment Re-run",
        user: "Agent A-4782",
        aiUsed: true,
        details: "Damage assessment regenerated using automated vision model",
      }
      setAuditLog([auditEntry, ...auditLog])
    }, 2000)
  }

  const updateDamageSeverity = (index: number, newSeverity: "Minor" | "Moderate" | "Major" | "Severe") => {
    const updated = [...damageResults]
    updated[index].severity = newSeverity
    updated[index].edited = true
    setDamageResults(updated)
    setHasAIFeedback(true)
    recalculateCost(updated)

    const auditEntry: AuditLogEntry = {
      timestamp: new Date(),
      action: "Damage Assessment Edited",
      user: "Agent A-4782",
      aiUsed: false,
      details: `Severity changed to ${newSeverity} for ${updated[index].type} (will train automated system)`,
    }
    setAuditLog([auditEntry, ...auditLog])
  }

  const updateDamageType = (index: number, newType: string) => {
    const updated = [...damageResults]
    updated[index].type = newType
    updated[index].edited = true
    setDamageResults(updated)
    setHasAIFeedback(true)
    recalculateCost(updated)

    const auditEntry: AuditLogEntry = {
      timestamp: new Date(),
      action: "Damage Type Edited",
      user: "Agent A-4782",
      aiUsed: false,
      details: `Damage type changed to "${newType}" (will train automated system)`,
    }
    setAuditLog([auditEntry, ...auditLog])
  }

  const removeDamage = (index: number) => {
    const updated = damageResults.filter((_, i) => i !== index)
    setDamageResults(updated)
    setHasAIFeedback(true)
    recalculateCost(updated)
  }

  const recalculateCost = (damages: DamageAssessment[]) => {
    const severityCosts = {
      Minor: { min: 200, max: 500 },
      Moderate: { min: 500, max: 1200 },
      Major: { min: 1200, max: 2500 },
      Severe: { min: 2500, max: 5000 },
    }

    let totalMin = 0
    let totalMax = 0

    damages.forEach((damage) => {
      const cost = severityCosts[damage.severity]
      totalMin += cost.min
      totalMax += cost.max
    })

    setEstimatedCost({ min: totalMin, max: totalMax })
    const midpoint = Math.round((totalMin + totalMax) / 2)
    setFinalEstimate(midpoint.toString())
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minor":
        return "bg-success/20 text-success border-success/30"
      case "Moderate":
        return "bg-warning/20 text-warning border-warning/30"
      case "Major":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "Severe":
        return "bg-destructive/30 text-destructive border-destructive/50"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const addNewDamage = () => {
    const newDamage: DamageAssessment = {
      type: "New Damage",
      severity: "Minor",
      confidence: 0,
      edited: true,
    }
    const updated = [...damageResults, newDamage]
    setDamageResults(updated)
    setHasAIFeedback(true)
    recalculateCost(updated)
  }

  const statusBadge = getStatusBadge(currentStatus)

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Smart Claims</h1>
          <Badge variant="outline" className="text-xs font-mono">
            Agent ID: A-4782
          </Badge>
        </div>
        <p className="text-muted-foreground">AI-powered vehicle damage assessment and claims processing</p>
      </div>

      {showStatusMessage && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Status Updated</p>
              <p className="text-sm text-muted-foreground mt-1">{latestStatusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Claim Header Card */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Claim Information</CardTitle>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <History className="h-4 w-4" />
                    Audit Log
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Claim Audit Log</DialogTitle>
                    <DialogDescription>Complete history of actions and AI usage for this claim</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {auditLog.map((entry, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-lg border",
                          entry.aiUsed ? "bg-purple-500/5 border-purple-500/20" : "bg-secondary/50 border-border/50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{entry.action}</p>
                            {entry.aiUsed && (
                              <Badge
                                variant="outline"
                                className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs"
                              >
                                AI Used
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {entry.timestamp.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">By {entry.user}</p>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Badge className={statusBadge.className} variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="font-mono font-semibold">POL-2024-8847392</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Policyholder</p>
                <p className="font-semibold">Sarah Mitchell</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incident Date</p>
                <p className="font-semibold">Dec 28, 2024</p>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Car className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-semibold">2022 Honda Accord</p>
                <p className="text-xs text-muted-foreground font-mono">VIN: 1HGCV1F3XMA123456</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Claim Type</p>
                <p className="font-semibold">Collision Damage</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coverage Limit</p>
                <p className="font-semibold">$50,000</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Image Upload Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Damage Documentation
            </CardTitle>
            <CardDescription>Vehicle damage photos submitted by policyholder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.length > 0 ? (
                  uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg border border-border overflow-hidden bg-secondary"
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Damage ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-secondary">
                      <img
                        src="/car-front-bumper-damage.jpg"
                        alt="Front damage"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-secondary">
                      <img src="/car-hood-dent-close-up.jpg" alt="Hood damage" className="object-cover w-full h-full" />
                    </div>
                    <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-secondary">
                      <img
                        src="/car-headlight-cracked.jpg"
                        alt="Headlight damage"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-secondary">
                      <img
                        src="/car-paint-scratches-side.jpg"
                        alt="Side damage"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Add More Photos</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className={cn("border-border/50 transition-all", hasAnalyzed && "ring-2 ring-primary/20")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Automated Damage Assessment
              </CardTitle>
              {hasAnalyzed && (
                <Badge variant="outline" className="text-xs font-mono">
                  Generated {assessmentTimestamp}
                </Badge>
              )}
            </div>
            <CardDescription>Powered by computer vision and standardized repair data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRerunAssessment}
                  disabled={isAnalyzing}
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Re-analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Re-run Assessment
                    </>
                  )}
                </Button>
              </div>

              {hasAIFeedback && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent">
                    Your edits will train the automated system to improve future damage detection accuracy
                  </p>
                </div>
              )}

              {/* Detected Damage Types */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Detected Damage Types
                </h4>
                <div className="space-y-2">
                  {damageResults.map((damage, idx) => (
                    <div key={idx} className="space-y-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <div className="flex items-center gap-2">
                        <Input
                          value={damage.type}
                          onChange={(e) => updateDamageType(idx, e.target.value)}
                          className="flex-1 h-8 text-sm font-medium"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDamage(idx)}
                          className="h-8 px-2 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Severity:</Label>
                          <select
                            value={damage.severity}
                            onChange={(e) =>
                              updateDamageSeverity(idx, e.target.value as "Minor" | "Moderate" | "Major" | "Severe")
                            }
                            className={cn(
                              "text-xs px-2 py-1 rounded border bg-background",
                              getSeverityColor(damage.severity),
                            )}
                          >
                            <option value="Minor">Minor</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Major">Major</option>
                            <option value="Severe">Severe</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Confidence:</Label>
                          {damage.edited ? (
                            <Badge variant="outline" className="h-7 px-2 text-xs font-medium">
                              Edited
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-mono font-semibold">{damage.confidence}</span>
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={addNewDamage}
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed hover:border-solid bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Damage Entry
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Cost Estimate */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Estimated Repair Cost
                </h4>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="space-y-1 cursor-help">
                          <p className="text-xs text-muted-foreground">Automated Assessment Range</p>
                          <p className="text-2xl font-bold font-mono">
                            ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-semibold text-xs">Data Sources:</p>
                          <div className="text-xs space-y-1">
                            <p>• Audatex DB: Entry #AX-2024-92847</p>
                            <p>• Similar Claim: POL-2024-7743221 ($2,950)</p>
                            <p>• Similar Claim: POL-2023-9912037 ($3,180)</p>
                            <p>• Market Rate: Honda Accord 2020-2024</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Overall Confidence */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Overall Confidence Score
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all"
                        style={{ width: `${overallConfidence}%` }}
                      />
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={overallConfidence}
                      onChange={(e) => {
                        setOverallConfidence(Math.max(0, Math.min(100, Number.parseInt(e.target.value) || 0)))
                        setHasAIFeedback(true)
                      }}
                      className="w-20 h-8 text-sm font-semibold font-mono text-center"
                    />
                    <span className="text-sm font-semibold">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {overallConfidence >= 90
                      ? "High confidence - assessment is reliable"
                      : overallConfidence >= 75
                        ? "Moderate confidence - review recommended"
                        : "Low confidence - manual review required"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Review Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Agent Review & Final Assessment
          </CardTitle>
          <CardDescription>
            You are responsible for the final estimate. AI recommendations are advisory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="final-estimate">Final Estimated Cost ($)</Label>
              <Input
                id="final-estimate"
                type="number"
                value={finalEstimate}
                onChange={(e) => setFinalEstimate(e.target.value)}
                className="font-mono text-lg"
                placeholder="Enter final estimate"
              />
            </div>
            <div className="space-y-2">
              <Label>Automated Assessment Range</Label>
              <div className="h-10 flex items-center px-3 rounded-md border border-border bg-muted text-muted-foreground font-mono">
                ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-notes">Internal Notes</Label>
            <Textarea
              id="agent-notes"
              value={agentNotes}
              onChange={(e) => setAgentNotes(e.target.value)}
              placeholder="Add any additional observations, concerns, or recommendations for this claim..."
              className="min-h-32 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        {currentStatus === "UNDER_REVIEW" && (
          <>
            <Button size="lg" className="flex-1" onClick={handleSubmitForApproval}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
            <Button size="lg" variant="outline" className="flex-1 bg-transparent">
              <Camera className="h-4 w-4 mr-2" />
              Request More Photos
            </Button>
          </>
        )}

        {currentStatus === "PENDING" && (
          <div className="flex-1 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
            <p className="text-sm font-semibold text-yellow-500">Awaiting adjuster approval...</p>
          </div>
        )}

        {currentStatus === "APPROVED" && (
          <div className="flex-1 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <p className="text-sm font-semibold text-green-500">Preparing Repair Authorization...</p>
          </div>
        )}

        {currentStatus === "CLOSED" && (
          <>
            <Button size="lg" className="flex-1" onClick={handleDownloadRA}>
              <Download className="h-4 w-4 mr-2" />
              Download Repair Authorization
            </Button>
            <Button size="lg" variant="outline" className="flex-1 bg-transparent" disabled>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Claim Closed
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
