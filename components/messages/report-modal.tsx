"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { reportMessageAction } from "@/lib/actions/inbox";
import { useToast } from "@/components/ui/toast";
import { ReportReason } from "@/types/database";

interface ReportModalProps {
  messageId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: "harassment",
    label: "Harassment",
    description: "Repeated, targeted, or hostile unwanted attention",
  },
  {
    value: "bullying",
    label: "Bullying",
    description: "Intimidation or personal attacks",
  },
  {
    value: "hate",
    label: "Hate Speech",
    description: "Attacks based on race, religion, gender, or identity",
  },
  {
    value: "threat",
    label: "Violence or Threats",
    description: "Threatening physical harm or illegal activities",
  },
  {
    value: "sexual_content",
    label: "Sexual Content",
    description: "Unsolicited sexually explicit messages",
  },
  {
    value: "spam",
    label: "Spam or Advertising",
    description: "Repetitive promotional material or nonsense",
  },
  {
    value: "other",
    label: "Other Abuse",
    description: "Other harmful or violating behavior",
  },
];

export function ReportModal({ messageId, isOpen, onClose }: ReportModalProps) {
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = React.useState<ReportReason>("harassment");
  const [details, setDetails] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("messageId", messageId);
    formData.append("reason", selectedReason);
    formData.append("details", details);

    try {
      const res = await reportMessageAction(formData);
      if (res.success) {
        toast("Report submitted for moderator review.", "success");
        onClose();
        setDetails("");
      } else {
        toast(res.error || "Failed to submit report.", "error");
      }
    } catch {
      toast("An error occurred submitting the report.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Confession"
      description="Help keep RPLTwoFess safe. Reports are promptly reviewed by moderators."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9DA5]">
            Select Reason
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {REPORT_REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedReason === r.value
                    ? "bg-[#3D5CFF]/15 border-[#3D5CFF] shadow-[0_0_12px_rgba(61,92,255,0.2)]"
                    : "bg-[#181B21] border-[#2A2D34] hover:border-[#3E424C]"
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.value}
                  checked={selectedReason === r.value}
                  onChange={() => setSelectedReason(r.value)}
                  className="mt-0.5 accent-[#3D5CFF]"
                />
                <div>
                  <span className="block text-xs font-semibold text-[#F5F5F2]">
                    {r.label}
                  </span>
                  <span className="text-[11px] text-[#9A9DA5]">
                    {r.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9DA5]">
            Additional Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Describe any additional context..."
            className="w-full p-3 rounded-lg bg-[#181B21] border border-[#2A2D34] text-xs font-medium text-[#F5F5F2] placeholder-[#9A9DA5]/50 focus:outline-none focus:border-[#3D5CFF] focus:ring-1 focus:ring-[#3D5CFF]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
}
