"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // Suspense eklendi
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

// Component that reads URL parameters and handles the payment
function PaymentContent() {
  const searchParams = useSearchParams();
  const credits = searchParams.get("credits");
  const amount = searchParams.get("amount");
  const userId = searchParams.get("userId");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleApprove = async () => {
    setStatus("loading");
    
    // Send request to test API that adds credits to database
    try {
      const res = await fetch("/api/test/add-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits: Number(credits) }),
      });

      if (res.ok) {
        setStatus("success");
        toast.success("Payment approved successfully!");
      } else {
        toast.error("An error occurred");
        setStatus("idle");
      }
    } catch (error) {
      console.error(error);
      setStatus("idle");
      toast.error("Connection error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-600 mb-6"><b>{credits} credits</b> have been added to your account.</p>
          <Button onClick={() => window.close()} variant="outline" className="w-full">
            Close Window
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <span className="text-2xl">🚧</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Test Payment Screen</h2>
        <p className="text-slate-500 text-sm mb-6">
          Payment integration not yet configured. This screen is for development purposes.
        </p>

        <div className="bg-slate-100 p-4 rounded-lg mb-6 text-left space-y-2">
            <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-slate-900">${amount}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">Credits:</span>
                <span className="font-bold text-indigo-600">{credits}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <Button variant="destructive" className="w-full" disabled={status === "loading"}>
               <XCircle className="w-4 h-4 mr-2"/> Reject
            </Button>
            <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-500 text-white" disabled={status === "loading"}>
               {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4 mr-2"/>}
               Approve
            </Button>
        </div>
      </div>
    </div>
  );
}

// Main component serves only as Suspense wrapper
export default function MockPaymentPage() {
  return (
    // Show a simple loading screen until URL parameters are loaded
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}