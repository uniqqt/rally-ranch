"use client";

import Image from "next/image";
import { MapPin, Phone, Clock, Share2, Globe } from "lucide-react";

const FB_URL = "https://www.facebook.com/profile.php?id=61586869834234";
const PHONE = "0961-812-7180";
const MAPS_URL = "https://maps.app.goo.gl/4N6cydf9YHFfJYmE9";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Rally Ranch Pickleball"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <span className="text-white font-extrabold text-lg leading-none">Rally Ranch</span>
                <p className="text-blue-400 text-xs font-medium tracking-widest uppercase leading-none mt-0.5">Pickleball Court</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built for the long rally. Premier pickleball destination
              for players of all skill levels — come play!
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                title="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={`https://m.me/${FB_URL.split("id=")[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                title="Message on Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "#booking", label: "Book a Court" },
                { href: "#pricing", label: "Pricing" },
                { href: "/status", label: "My Booking" },
                { href: "#location", label: "Location" },
                { href: FB_URL, label: "Follow on Facebook", external: true },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-yellow-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact & Hours</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Rally Ranch Pickleball Court<br />
                  <span className="text-blue-400 text-xs">View on Google Maps →</span>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a
                  href={`tel:${PHONE.replace(/-/g, "")}`}
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  {PHONE}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Sun–Wed: 4:00 PM – 11:00 PM</p>
                  <p className="text-slate-400 text-sm">Thu–Sat: 4:00 PM – 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Rally Ranch Pickleball. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-slate-700 hover:text-slate-500 text-xs transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
