import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../common/ui/dialog"
import { Button } from "../../../common/ui/button"
import { Badge } from "../../../common/ui/badge"

export default function IncidentPaywallModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border border-cyan-500/20 bg-[#0B0F17] text-gray-100 shadow-2xl">

        {/* Header */}
        <DialogHeader className="space-y-2">
          <Badge className="w-fit bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            INVESTIGATE SECURITY INCIDENT
          </Badge>

          <DialogTitle className="text-2xl font-semibold">
            Subscription required
          </DialogTitle>
        </DialogHeader>

        {/* Message */}
        <div className="text-sm text-gray-400 leading-relaxed">
          Thank you for using DevOops, we hope you had a great experience with our platform.
          To continue investigating this security incident, a subscription to our <span className="text-cyan-400">DevOops Professional Core Security Tier</span> is required.
        </div>

        <div className="text-sm text-gray-400 leading-relaxed">  
          Unlocking the full investigation will provide you with comprehensive insights, including:
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            "Incident description",
            "Detailed forensic logs",
            "Source IP geolocation graph",
            "AI-supported security patch recommendations",
          ].map((f) => (
            <div
              key={f}
              className="p-3 rounded-lg border border-white/10 bg-white/5 text-sm hover:border-cyan-500/40 transition"
            >
              {f}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400 leading-relaxed mt-3">
          Alternatively, you can ignore the security incident and continue without the subscription, but please note that no further details will be available for this incident.
        </div>

        {/* Pricing */}
        <div className="mt-2 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <p className="text-xs text-gray-400 tracking-widest">
            SECURITY ACCESS LICENSE
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-red-400">$29</span>
            <span className="text-sm text-gray-400">/ month</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Cancel anytime. No incident data stored locally.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            Unlock full investigation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}