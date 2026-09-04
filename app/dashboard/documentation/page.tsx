import { getAllDocumentation } from "@/lib/queries/documentation";
import { DocumentationManager } from "@/components/documentation/documentation-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi Kelas | RPLTwoFess Admin",
  description: "Kelola foto dan arsip dokumentasi kelas pada homepage.",
};

export const dynamic = "force-dynamic";

export default async function DocumentationPage() {
  const items = await getAllDocumentation();

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      <DocumentationManager initialItems={items} />
    </div>
  );
}
