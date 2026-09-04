import { notFound } from "next/navigation";
import { getMessageById } from "@/lib/queries/messages";
import { MessageDetailView } from "@/components/messages/message-detail-view";

interface MessageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MessageDetailPage({
  params,
}: MessageDetailPageProps) {
  const { id } = await params;
  const message = await getMessageById(id);

  if (!message) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <MessageDetailView message={message} />
    </div>
  );
}
