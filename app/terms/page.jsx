"use client";

import Footer from "@/components/Footer";

export default function TermsAndConditions() {
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
              Terms and Conditions
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-zinc-800 dark:text-zinc-400 mx-auto">
            Please read these terms carefully before using our website or services.
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Terms and Conditions Content */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-4xl mx-auto prose prose-zinc dark:prose-invert">
          <div className="space-y-8 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using the website of Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                2. Use of Website
              </h2>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-4">
                2.1 Permitted Use
              </h3>
              <p className="leading-relaxed mb-3">
                You may use our website for lawful purposes only. You agree to use the website in accordance with all applicable laws and regulations. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the website in any way that violates any applicable law or regulation</li>
                <li>Transmit any malicious code, viruses, or harmful software</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
                <li>Interfere with or disrupt the website or servers connected to it</li>
                <li>Use automated systems to access the website without permission</li>
                <li>Copy, reproduce, or distribute content without authorization</li>
              </ul>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
                2.2 User Accounts
              </h3>
              <p className="leading-relaxed">
                If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                3. Intellectual Property
              </h2>
              <p className="leading-relaxed mb-3">
                All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Pragati Prime or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use any content from this website without our prior written permission, except for personal, non-commercial use.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                4. Donations and Payments
              </h2>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-4">
                4.1 Donation Terms
              </h3>
              <p className="leading-relaxed mb-3">
                When you make a donation through our website:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Donations are voluntary and non-refundable unless required by law</li>
                <li>All donations are used to support our programs and initiatives</li>
                <li>You will receive a receipt for tax purposes if applicable</li>
                <li>We reserve the right to refuse any donation at our discretion</li>
              </ul>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
                4.2 Payment Processing
              </h3>
              <p className="leading-relaxed">
                Payments are processed through secure third-party payment processors. We do not store your complete payment card information. By making a payment, you agree to the terms and conditions of the payment processor.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                5. Membership and Programs
              </h2>
              <p className="leading-relaxed mb-3">
                If you register for membership or participate in our programs:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must provide accurate and complete information</li>
                <li>You must comply with all program rules and guidelines</li>
                <li>We reserve the right to accept or reject any membership application</li>
                <li>We may modify or discontinue programs at any time</li>
                <li>Participation in programs is subject to availability and eligibility criteria</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                6. User Content
              </h2>
              <p className="leading-relaxed mb-3">
                If you submit content to our website (such as comments, feedback, or testimonials), you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content for our organizational purposes.
              </p>
              <p className="leading-relaxed">
                You represent and warrant that you own or have the right to submit such content and that it does not violate any third-party rights or applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                7. Disclaimers
              </h2>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-4">
                7.1 Website Availability
              </h3>
              <p className="leading-relaxed">
                We strive to keep our website available and functioning, but we do not guarantee uninterrupted or error-free access. The website is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
              </p>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
                7.2 Information Accuracy
              </h3>
              <p className="leading-relaxed">
                While we make every effort to ensure the accuracy of information on our website, we do not warrant that all information is complete, current, or error-free. Information may be updated or changed without notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, Pragati Prime shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the website or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                9. Indemnification
              </h2>
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless Pragati Prime, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the website, violation of these terms, or infringement of any rights of another party.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                10. Third-Party Links
              </h2>
              <p className="leading-relaxed">
                Our website may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. Your use of third-party sites is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                11. Modifications to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes by posting the updated terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the website after changes constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                12. Termination
              </h2>
              <p className="leading-relaxed">
                We reserve the right to terminate or suspend your access to the website and services at any time, without prior notice, for any reason, including if you violate these Terms and Conditions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                13. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                14. Severability
              </h2>
              <p className="leading-relaxed">
                If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                15. Contact Information
              </h2>
              <p className="leading-relaxed mb-3">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 mt-4">
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold mb-3">Pragati Prime</p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  <strong>Email:</strong> <a href="mailto:info@pragatiprime.org" className="text-primary hover:underline">info@pragatiprime.org</a>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  <strong>Phone:</strong> +91-7006527696
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  <strong>WhatsApp:</strong> +91-7006527696
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  <strong>Registered Address:</strong> D-318, Flat No.8, Third Floor, Krishna Park, Devli Road, Khanpur, South Delhi, New Delhi-110062
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>Correspondence Address:</strong> A-3, Indra Enclave, Neb Sarai, Near IGNOU, South Delhi, New Delhi-110068
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

