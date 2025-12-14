"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const getSocialIcon = (platform) => {
  const icons = {
    facebook: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
    twitter: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
    instagram: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    linkedin: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    youtube: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  };
  return icons[platform] || icons.facebook;
};

export default function Footer() {
  const [footerData, setFooterData] = useState({
    description: "Empowering communities for a better tomorrow through education, healthcare, and sustainable development programs.",
    email: "info@pragatiprime.org",
    phone: "+1 (555) 123-4567",
    address: "123 Community Street\nCity, State 12345",
    copyright: "© 2025 Pragati Prime. All rights reserved.",
    logoUrl: "/logo1.jpeg"
  });
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialIcons, setSocialIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooterData() {
      const supabase = createClient();
      try {
        const [settingsResult, linksResult, iconsResult] = await Promise.all([
          supabase.from("site_settings").select("*").limit(1).maybeSingle(),
          supabase.from("footer_links").select("*").order("display_order", { ascending: true }),
          supabase.from("footer_social_icons").select("*").order("display_order", { ascending: true })
        ]);

        if (settingsResult.data) {
          setFooterData({
            description: settingsResult.data.footer_description || "Empowering communities for a better tomorrow through education, healthcare, and sustainable development programs.",
            email: settingsResult.data.footer_email || "info@pragatiprime.org",
            phone: settingsResult.data.footer_phone || "+1 (555) 123-4567",
            address: settingsResult.data.footer_address || "123 Community Street\nCity, State 12345",
            copyright: settingsResult.data.footer_copyright || "© 2025 Pragati Prime. All rights reserved.",
            logoUrl: settingsResult.data.logo_url || "/logo1.jpeg"
          });
        }
        setFooterLinks(linksResult.data || []);
        setSocialIcons(iconsResult.data || []);
      } catch (error) {
        console.error("Error loading footer data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFooterData();
  }, []);

  const quickLinks = footerLinks.filter(link => link.section === "quick_links");
  const resources = footerLinks.filter(link => link.section === "resources");
  const legalLinks = footerLinks.filter(link => link.section === "legal");

  if (loading) {
    return (
      <footer className="bg-linear-to-r from-primary/10 to-secondary/20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6">
          <div className="text-center text-muted-foreground">Loading footer...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-linear-to-r from-primary/10 to-secondary/20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-5">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity mb-4">
              <Image 
                src={footerData.logoUrl} 
                alt="Pragati Prime Logo" 
                width={100} 
                height={100} 
                className="rounded-full object-contain h-16 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              {footerData.description}
            </p>
            <div className="mt-4 sm:mt-6 flex space-x-4">
              {socialIcons.map((icon) => (
                <a 
                  key={icon.id} 
                  href={icon.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{icon.platform}</span>
                  {getSocialIcon(icon.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
              <ul className="mt-4 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="mt-4 space-y-3">
                {resources.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3">
              {footerData.email && (
                <li className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span><br />
                  {footerData.email}
                </li>
              )}
              {footerData.phone && (
                <li className="text-sm text-muted-foreground">
                  <span className="font-medium">Phone:</span><br />
                  {footerData.phone}
                </li>
              )}
              {footerData.address && (
                <li className="text-sm text-muted-foreground">
                  <span className="font-medium">Address:</span><br />
                  {footerData.address.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 border-t border-border pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {footerData.copyright}
            </p>
            {legalLinks.length > 0 && (
              <div className="flex space-x-6">
                {legalLinks.map((link) => (
                  <Link key={link.id} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
