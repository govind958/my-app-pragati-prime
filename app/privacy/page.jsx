"use client";

import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-zinc-800 dark:text-zinc-400 mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-4xl mx-auto prose prose-zinc dark:prose-invert">
          <div className="space-y-8 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-4">
                2.1 Personal Information
              </h3>
              <p className="leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Register for membership or programs</li>
                <li>Make donations or contributions</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Contact us through forms or email</li>
                <li>Participate in surveys or feedback</li>
              </ul>
              <p className="leading-relaxed mt-4">
                This information may include your name, email address, phone number, postal address, payment information, and other details you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
                2.2 Automatically Collected Information
              </h3>
              <p className="leading-relaxed mb-3">
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Date and time of access</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-3">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process donations and transactions</li>
                <li>To send you updates, newsletters, and information about our programs</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To comply with legal obligations and regulatory requirements</li>
                <li>To analyze website usage and improve user experience</li>
                <li>To prevent fraud and ensure security</li>
                <li>To communicate about events, programs, and opportunities</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website, conducting our programs, or serving our users, provided they agree to keep this information confidential.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to protect our rights, property, or safety.</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent for specific purposes.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                5. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="leading-relaxed mb-3">
                You have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations.</li>
                <li><strong>Opt-out:</strong> You can opt-out of receiving marketing communications from us by following the unsubscribe instructions in our emails.</li>
                <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:info@pragatiprime.org" className="text-primary hover:underline">info@pragatiprime.org</a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to collect and store information about your preferences and browsing behavior. You can control cookies through your browser settings, though this may affect website functionality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                8. Third-Party Links
              </h2>
              <p className="leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                9. Children&apos;s Privacy
              </h2>
              <p className="leading-relaxed">
                Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                11. Contact Us
              </h2>
              <p className="leading-relaxed mb-3">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 mt-4">
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold mb-2">Pragati Prime</p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Email: <a href="mailto:info@pragatiprime.org" className="text-primary hover:underline">info@pragatiprime.org</a>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Phone: +1 (555) 123-4567
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Address: 123 Community Street, City, State 12345
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

