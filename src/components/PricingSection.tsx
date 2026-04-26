"use client";

import { Clock, Zap } from "lucide-react";

const tiers = [
  {
    name: "Afternoon Rate",
    time: "4:00 PM – 6:00 PM",
    note: "All days",
    price: 150,
    color: "from-blue-500 to-cyan-500",
    border: "border-blue-500/30",
    icon: <Clock className="w-5 h-5" />,
    slots: ["4:00 PM – 5:00 PM", "5:00 PM – 6:00 PM"],
    tag: "Early Bird",
    tagColor: "bg-blue-500/20 text-blue-300",
  },
  {
    name: "Evening Rate",
    time: "6:00 PM – 11:00 PM",
    note: "Thu–Sat until 12:00 AM",
    price: 200,
    color: "from-purple-500 to-pink-500",
    border: "border-purple-500/30",
    icon: <Zap className="w-5 h-5" />,
    slots: [
      "6:00 PM – 7:00 PM",
      "7:00 PM – 8:00 PM",
      "8:00 PM – 9:00 PM",
      "9:00 PM – 10:00 PM",
      "10:00 PM – 11:00 PM",
      "11:00 PM – 12:00 AM ✦",
    ],
    tag: "Prime Time",
    tagColor: "bg-purple-500/20 text-purple-300",
  },
];

const schedule = [
  { days: "Sunday – Wednesday", hours: "4:00 PM – 11:00 PM", icon: <Clock className="w-4 h-4" /> },
  { days: "Thursday – Saturday", hours: "4:00 PM – 12:00 AM", icon: <Zap className="w-4 h-4" /> },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Rates</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Each session is 1 hour. Choose your preferred time and enjoy the courts.
          </p>
        </div>

        {/* Schedule summary */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          {schedule.map((s) => (
            <div
              key={s.days}
              className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/50 rounded-xl px-5 py-3"
            >
              <span className="text-blue-400">{s.icon}</span>
              <div>
                <p className="text-white text-sm font-semibold">{s.days}</p>
                <p className="text-slate-400 text-xs">{s.hours}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${tier.border} bg-slate-900/80 p-8 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${tier.color}`} />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tier.tagColor}`}>
                    {tier.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{tier.time}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{tier.note}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${tier.color} text-white`}>
                  {tier.icon}
                </div>
              </div>

              <div className="mb-6">
                <span className={`text-5xl font-extrabold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  ₱{tier.price}
                </span>
                <span className="text-slate-400 text-sm ml-2">/ session</span>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Available slots</p>
                {tier.slots.map((slot) => (
                  <div key={slot} className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tier.color}`} />
                    {slot}
                  </div>
                ))}
              </div>

              <a
                href="#booking"
                className={`mt-8 block w-full text-center bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg`}
              >
                Book This Rate
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Payment via GCash required to confirm booking. See payment section below.
        </p>
      </div>
    </section>
  );
}
