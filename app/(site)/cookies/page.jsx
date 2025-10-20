"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl sm:tracking-tight lg:text-5xl">
                Cookie Policy
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
                This Cookie Policy explains how IvyWay Tutoring ("we," "our," or
                "us") uses cookies, similar tracking technologies, and your
                choices regarding these technologies on our website and
                services.
              </p>
              <p className="text-gray-700 mb-4">
                By using our website, you consent to the use of cookies in
                accordance with this Cookie Policy. If you do not accept the use
                of cookies, please disable them as described below or refrain
                from using our website.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. What Are Cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your device when
                you visit a website. They are widely used to make websites work
                more efficiently and provide information to the website owners.
                Cookies can be "persistent" or "session" cookies.
              </p>
              <p className="text-gray-700 mb-4">
                Persistent cookies remain on your device for a set period or
                until manually deleted, while session cookies are deleted when
                you close your browser.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Types of Cookies We Use
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3.1 Essential Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function
                properly. They enable core functionality such as security,
                network management, and account access. You cannot opt out of
                these cookies.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3.2 Functional Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies enhance the functionality of our website by
                storing your preferences. They may be set by us or by
                third-party providers whose services we have added to our pages.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3.3 Analytics Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how visitors use our
                website, including which pages visitors go to most often and if
                they receive error messages. We use this information to improve
                our website and services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3.4 Marketing Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies track your online activity to help advertisers
                deliver more relevant advertising or to limit how many times you
                see an ad. These cookies can share information with other
                organizations or advertisers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Specific Cookies We Use
              </h2>
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                      >
                        Cookie Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                      >
                        Purpose
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        PHPSESSID
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Preserves user session state
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Essential
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Session
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        _ga
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Registers a unique ID used to generate statistical data
                        on how the visitor uses the website
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Analytics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        2 years
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        _gid
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Registers a unique ID used to generate statistical data
                        on how the visitor uses the website
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Analytics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        24 hours
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        _gat
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Used by Google Analytics to throttle request rate
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Analytics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        1 minute
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        user_preferences
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Stores user preferences such as display settings
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Functional
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        1 year
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                        _fbp
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r">
                        Used by Facebook to deliver advertisements
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r">
                        Marketing
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        3 months
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                This is not an exhaustive list and may be updated periodically.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Third-Party Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Our website may use third-party services that employ cookies,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Google Analytics (for website analytics)</li>
                <li>Google Ads (for advertising)</li>
                <li>
                  Facebook Pixel (for advertising and conversion tracking)
                </li>
                <li>Stripe (for payment processing)</li>
                <li>Intercom (for customer messaging)</li>
                <li>Zendesk (for customer support)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These third-party service providers have their own privacy
                policies addressing how they use such information. We encourage
                you to read their privacy policies to understand how they
                collect and process your information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Managing Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to manage your cookie preferences.
                You can:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Delete cookies from your device</li>
                <li>
                  Block cookies by activating settings on your browser that
                  allow you to refuse all or some cookies
                </li>
                <li>
                  Set your browser to notify you when you receive a cookie
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Please note that if you choose to block or delete cookies, you
                may not be able to access certain areas or features of our
                website, and some services may not function properly.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How to Manage Cookies in Popular Browsers
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and security →
                    Cookies and other site data
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security →
                    Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies and
                    website data
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Site permissions → Cookies
                    and site data
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 mb-4">
                Additionally, you can opt out of some third-party cookies
                directly through the service providers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Google Analytics:{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://tools.google.com/dlpage/gaoptout
                  </a>
                </li>
                <li>
                  Google Ads:{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://www.google.com/settings/ads
                  </a>
                </li>
                <li>
                  Facebook:{" "}
                  <a
                    href="https://www.facebook.com/settings/?tab=ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://www.facebook.com/settings/?tab=ads
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Do Not Track Signals
              </h2>
              <p className="text-gray-700 mb-4">
                Some browsers have a "Do Not Track" feature that signals to
                websites that you visit that you do not want to have your online
                activity tracked. Due to the lack of a common interpretation of
                Do Not Track signals across the industry, we currently do not
                respond to Do Not Track signals on our website.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Changes to This Cookie Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect
                changes in technology, regulation, or our business practices. We
                will notify you of any material changes by posting the updated
                Cookie Policy on this page with a new effective date. We
                encourage you to periodically review this Cookie Policy for the
                latest information on our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies or this
                Cookie Policy, please contact us at:
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
              href="/privacy"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <h3 className="font-medium text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600">
                Learn how we collect and use your information
              </p>
            </Link>

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
