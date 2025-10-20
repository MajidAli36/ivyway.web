"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl sm:tracking-tight lg:text-5xl">
                Terms of Service
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
                Welcome to IvyWay Tutoring. These Terms of Service ("Terms")
                govern your access to and use of the IvyWay website, mobile
                applications, and services (collectively, the "Services").
              </p>
              <p className="text-gray-700 mb-4">
                By accessing or using our Services, you agree to be bound by
                these Terms and our Privacy Policy. If you do not agree to these
                Terms, please do not use our Services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Eligibility
              </h2>
              <p className="text-gray-700 mb-4">
                You must be at least 13 years old to use our Services. If you
                are under 18, you represent that you have your parent or
                guardian's permission to use the Services and that they have
                read and agree to these Terms on your behalf.
              </p>
              <p className="text-gray-700 mb-4">
                By using our Services, you represent and warrant that you meet
                all eligibility requirements and that you will not use the
                Services in a way that violates any laws or regulations.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Account Registration
              </h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Services, you may be required
                to register for an account. You agree to provide accurate,
                current, and complete information during the registration
                process and to update such information to keep it accurate,
                current, and complete.
              </p>
              <p className="text-gray-700 mb-4">
                You are responsible for safeguarding your account credentials
                and for any activities or actions under your account. You agree
                to notify us immediately of any unauthorized use of your
                account.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to use the Services only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Use the Services in any way that violates any applicable law
                  or regulation
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  otherwise misrepresent your affiliation with a person or
                  entity
                </li>
                <li>
                  Interfere with or disrupt the Services or servers or networks
                  connected to the Services
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  Services or any other systems or networks
                </li>
                <li>
                  Use the Services to send unsolicited commercial communications
                </li>
                <li>
                  Engage in any conduct that restricts or inhibits anyone's use
                  or enjoyment of the Services
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Tutoring Services
              </h2>
              <p className="text-gray-700 mb-4">
                IvyWay connects students with tutors for educational purposes.
                By scheduling tutoring sessions through our platform, you agree
                to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Be present and on time for scheduled sessions</li>
                <li>
                  Provide at least 24 hours' notice for cancellations when
                  possible
                </li>
                <li>Treat tutors with respect and professionalism</li>
                <li>
                  Pay for services according to the rates and terms specified at
                  the time of booking
                </li>
                <li>
                  Use the materials and guidance provided by tutors for your
                  personal educational purposes only
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                While we make every effort to ensure the quality of our tutors,
                we cannot guarantee specific academic outcomes or results from
                tutoring sessions.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Payments and Billing
              </h2>
              <p className="text-gray-700 mb-4">
                By purchasing tutoring services, you agree to pay all fees
                associated with the services. Prices for services are displayed
                at the time of booking and may vary based on subject, tutor, and
                session length.
              </p>
              <p className="text-gray-700 mb-4">
                Payment is required at the time of booking unless otherwise
                specified. We accept major credit cards, debit cards, and other
                payment methods as indicated on our platform.
              </p>
              <p className="text-gray-700 mb-4">
                All purchases are final, but refunds may be available in certain
                circumstances as outlined in our Refund Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The Services and their entire contents, features, and
                functionality (including but not limited to all information,
                software, text, displays, images, video, and audio, and the
                design, selection, and arrangement thereof) are owned by IvyWay,
                its licensors, or other providers of such material and are
                protected by copyright, trademark, patent, trade secret, and
                other intellectual property or proprietary rights laws.
              </p>
              <p className="text-gray-700 mb-4">
                You are granted a limited, non-exclusive, non-transferable,
                revocable license to access and use the Services for your
                personal, non-commercial use. You may not:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Reproduce, distribute, modify, create derivative works of,
                  publicly display, publicly perform, republish, download,
                  store, or transmit any of the material on our Services
                </li>
                <li>
                  Use any illustrations, photographs, video or audio sequences,
                  or any graphics separately from the accompanying text
                </li>
                <li>
                  Delete or alter any copyright, trademark, or other proprietary
                  rights notices from copies of materials from the Services
                </li>
                <li>
                  Access or use for any commercial purposes any part of the
                  Services or any services or materials available through the
                  Services
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. User Content
              </h2>
              <p className="text-gray-700 mb-4">
                Our Services may allow you to post, submit, publish, display, or
                transmit content or materials. By providing any content on the
                Services, you grant us and our affiliates and service providers
                a non-exclusive, transferable, royalty-free, worldwide license
                to use, reproduce, modify, perform, display, distribute, and
                otherwise disclose to third parties any such material.
              </p>
              <p className="text-gray-700 mb-4">
                You represent and warrant that all content you provide is
                accurate, complete, and does not violate these Terms or any
                applicable law.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend your account or
                access to our Services, with or without notice, for any reason,
                including if we believe you have violated these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time by contacting us.
                Upon termination, your right to use the Services will
                immediately cease.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700 mb-4">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE
                FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mb-4">
                WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
                ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES
                OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR
                OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL IVYWAY,
                ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS,
                EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES
                OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN
                CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES,
                INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Indemnification
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to defend, indemnify, and hold harmless IvyWay, its
                affiliates, licensors, and service providers, and its and their
                respective officers, directors, employees, contractors, agents,
                licensors, suppliers, successors, and assigns from and against
                any claims, liabilities, damages, judgments, awards, losses,
                costs, expenses, or fees (including reasonable attorneys' fees)
                arising out of or relating to your violation of these Terms or
                your use of the Services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms and your use of the Services shall be governed by
                and construed in accordance with the laws of the State of
                California, without giving effect to any choice or conflict of
                law provision or rule.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Dispute Resolution
              </h2>
              <p className="text-gray-700 mb-4">
                Any legal action or proceeding relating to your access to, or
                use of, the Services or these Terms shall be instituted in a
                state or federal court in San Francisco County, California. You
                agree to submit to the jurisdiction of, and agree that venue is
                proper in, these courts in any such legal action or proceeding.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                15. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We may revise and update these Terms from time to time at our
                sole discretion. All changes are effective immediately when we
                post them. Your continued use of the Services following the
                posting of revised Terms means that you accept and agree to the
                changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                16. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:legal@ivyway.com"
                    className="text-blue-600 hover:underline"
                  >
                    legal@ivyway.com
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
              href="/privacy"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <h3 className="font-medium text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600">
                Learn how we collect and use your information
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
                Contact our support team for assistance
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
