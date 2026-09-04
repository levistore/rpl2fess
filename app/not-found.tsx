import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F3EA] flex flex-col justify-center items-center px-4 py-12 text-[#111111]">
      <div className="w-full max-w-lg text-center">
        <Card variant="yellow" shadow="lg" className="p-8 sm:p-12 border-[4px] border-[#111111] space-y-6">
          <span className="block font-black text-8xl sm:text-9xl tracking-tighter text-[#111111] select-none">
            404
          </span>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
              This Page Doesn’t Exist.
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#111111]/80 max-w-sm mx-auto leading-relaxed">
              Maybe someone deleted it. Maybe the username is wrong. Or maybe it never existed in the first place.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/">
              <Button variant="primary" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
