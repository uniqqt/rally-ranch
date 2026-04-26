"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/4N6cydf9YHFfJYmE9";
const EMBED_URL = "https://www.google.com/maps?q=9.4839931,123.1413974&z=17&output=embed";
const PHONE = "0961-812-7180";

export default function LocationSection() {
  return (
    <section id="location" className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Location</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Find{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Courts
            </span>
          </h2>
          <p className="text-slate-400 mt-3">Conveniently located and easy to access.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-500/10">
            <div className="relative w-full h-80 lg:h-96 bg-slate-800">
              <iframe
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rally Ranch Pickleball Court Location"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center -z-10">
                <div className="text-center text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Map loading…</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">Rally Ranch Pickleball Court</p>
                  <p className="text-slate-400 text-xs">Philippines</p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors flex-shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                Directions
              </a>
            </div>
          </div>

          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold">Address</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Rally Ranch Pickleball Court<br />
                Philippines
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <Navigation className="w-4 h-4" />
                View on Google Maps →
              </a>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold">Operating Hours</h4>
              </div>
              <div className="space-y-2">
                {[
                  { day: "Sunday – Wednesday", hours: "4:00 PM – 11:00 PM" },
                  { day: "Thursday – Saturday", hours: "4:00 PM – 12:00 AM" },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{item.day}</span>
                    <span className="text-white text-sm font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Open Today</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-white font-semibold">Contact</h4>
              </div>
              <a
                href={`tel:${PHONE.replace(/-/g, "")}`}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {PHONE}
              </a>
              <p className="text-slate-400 text-xs mt-1">Available during operating hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
