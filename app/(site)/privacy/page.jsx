"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl sm:tracking-tight lg:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
                Last Updated: April 17, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow-md rounded-xl p-8">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                IvyWay Tutoring ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website or use our tutoring services.
              </p>
              <p className="text-gray-700 mb-4">
                Please read this Privacy Policy carefully. By accessing or using
                our services, you acknowledge that you have read, understood,
                and agree to be bound by all the terms outlined in this Privacy
                Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Register for an account</li>
                <li>Sign up for tutoring services</li>
                <li>Complete profile information</li>
                <li>Submit a contact form</li>
                <li>Request information about our services</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700 mb-4">
                This information may include your name, email address, phone
                number, address, educational background, academic interests,
                payment information, and communication preferences.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.2 Automated Information
              </h3>
              <p className="text-gray-700 mb-4">
                When you visit our website or use our platform, we automatically
                collect certain information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Device information (browser type, operating system, device
                  type)
                </li>
                <li>IP address and approximate location based on IP address</li>
                <li>Pages visited and interactions with our site</li>
                <li>Referring websites or sources</li>
                <li>Time spent on our platform and session information</li>
                <li>Language preferences</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to collect this
                information. For more information about our use of cookies,
                please see our{" "}
                <Link href="/cookies" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for various business purposes,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Providing, maintaining, and improving our tutoring services
                </li>
                <li>Processing payments and managing your account</li>
                <li>Matching students with appropriate tutors</li>
                <li>
                  Communicating with you about your account or our services
                </li>
                <li>
                  Sending you marketing communications (subject to your
                  preferences)
                </li>
                <li>
                  Responding to your inquiries and providing customer support
                </li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Ensuring the security and integrity of our platform</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party service providers
                who help us operate our business and deliver services. These
                providers have access to your information only to perform
                specific tasks on our behalf and are obligated to protect your
                information.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.2 Tutors
              </h3>
              <p className="text-gray-700 mb-4">
                To facilitate tutoring services, we share relevant information
                with tutors assigned to work with you. This includes your name,
                academic needs, learning goals, and contact information
                necessary for scheduling sessions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.3 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required to do so by law or
                in response to valid legal requests, such as court orders,
                subpoenas, or government regulations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.4 Business Transfers
              </h3>
              <p className="text-gray-700 mb-4">
                If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as
                part of that transaction. We will notify you via email and/or
                prominent notice on our website of any such change in ownership.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.5 With Your Consent
              </h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third parties when you have
                given us your consent to do so.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, accidental loss, alteration, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Access:</strong> You can request a copy of the
                  personal information we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> You can request that we correct
                  inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request that we delete your
                  personal information in certain circumstances.
                </li>
                <li>
                  <strong>Restriction:</strong> You can request that we restrict
                  the processing of your information.
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of
                  your data in a structured, commonly used, and machine-readable
                  format.
                </li>
                <li>
                  <strong>Objection:</strong> You can object to the processing
                  of your personal information in certain circumstances.
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the
                information provided in the "Contact Us" section below.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our services are intended for users who are at least 13 years of
                age. For users under 18, we require parental consent for the use
                of our services. We do not knowingly collect personal
                information from children under 13. If you believe we have
                collected information from a child under 13, please contact us
                immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than the country in which you reside. These
                countries may have data protection laws that differ from the
                laws of your country. We implement appropriate safeguards to
                protect your information when transferred internationally.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the updated Privacy Policy on this page with a new
                effective date. We encourage you to review this Privacy Policy
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:privacy@ivyway.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@ivyway.com
                  </a>
                </p>
                <p className="text-gray-700">Phone: +1 (800) 123-4567</p>
                <p className="text-gray-700">
                  Address: 123 Education Ave, San Francisco, CA 94107, United
                  States
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Related Links */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Related Policies
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/terms"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <h3 className="font-medium text-gray-900 mb-2">
                Terms of Service
              </h3>
              <p className="text-sm text-gray-600">
                Read our terms and conditions for using IvyWay services
              </p>
            </Link>

            <Link
              href="/cookies"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <h3 className="font-medium text-gray-900 mb-2">Cookie Policy</h3>
              <p className="text-sm text-gray-600">
                Learn how we use cookies and similar technologies
              </p>
            </Link>

            <div className="bg-blue-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="font-medium text-gray-900 mb-2">
                Have Questions?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Contact our privacy team for more information
              </p>
              <Link
                href="/contact"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
