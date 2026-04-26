"use client";

import Image from "next/image";
import { Smartphone, Shield, Clock, CheckCircle } from "lucide-react";

const GCASH_NUMBER = "0961-812-7180";
const GCASH_NAME   = "Manuel Carlos Abanes";

export default function PaymentSection() {
  const steps = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "Complete your booking form above" },
    { icon: <Smartphone className="w-5 h-5" />, text: `Send payment via GCash to ${GCASH_NUMBER}` },
    { icon: <Shield className="w-5 h-5" />, text: "Send your GCash screenshot via Facebook Messenger or SMS (0961-812-7180)" },
    { icon: <Clock className="w-5 h-5" />, text: "We'll confirm your booking within 30 minutes" },
  ];

  return (
    <section id="payment" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Payment</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Pay via{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              GCash
            </span>
          </h2>
          <p className="text-slate-400 mt-3">Fast, easy, and secure mobile payment.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-5 rounded-3xl shadow-2xl shadow-blue-500/20 mb-6">
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden">
                <Image
                  src="/gcash-qr.png"
                  alt="GCash QR Code — Rally Ranch Pickleball"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">GCash Account Name</p>
              <p className="text-white font-bold text-xl">{GCASH_NAME}</p>
              <p className="text-blue-400 font-mono font-bold text-2xl tracking-widest mt-1">{GCASH_NUMBER}</p>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">How to Pay</h3>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
                    {step.icon}
                  </div>
                  <div className="pt-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {i + 1}</span>
                    <p className="text-slate-300 text-sm mt-0.5">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">Secure & Verified</p>
                  <p className="text-slate-400 text-xs mt-1">
                    All payments are verified manually. Your slot will be confirmed once we receive and validate your proof of payment.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#booking"
              className="mt-6 block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
            >
              Book & Pay Now →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
