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
      description="Help keep LConfess safe. Reports are promptly reviewed by moderators."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-[#111111]">
            Select Reason
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {REPORT_REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-start gap-3 p-3 rounded-[6px] border-[2px] cursor-pointer transition-all ${
                  selectedReason === r.value
                    ? "bg-[#FFD84D] border-[#111111] shadow-[2px_2px_0_#111111]"
                    : "bg-[#FFFFFF] border-[#111111]/30 hover:border-[#111111]"
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.value}
                  checked={selectedReason === r.value}
                  onChange={() => setSelectedReason(r.value)}
                  className="mt-0.5 accent-[#111111]"
                />
                <div>
                  <span className="block text-xs font-black uppercase text-[#111111]">
                    {r.label}
                  </span>
                  <span className="text-[11px] font-medium text-[#111111]/70">
                    {r.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-[#111111]">
            Additional Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Describe any additional context..."
            className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border-[2px] border-[#111111] text-xs font-medium focus:outline-none focus:border-[#5B7CFF]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="white"
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
