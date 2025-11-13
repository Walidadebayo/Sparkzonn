import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Privacy Policy | Sparkzonn",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: November 13, 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to Sparkzonn ("we," "us," "our"). We are committed to
                protecting your privacy and ensuring you have a positive
                experience on our website. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website https://sparkzonn.com.
              </p>
              <p>
                By using our website, you consent to the data practices
                described in this policy. If you do not agree with this policy,
                please do not access or use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                2.1 Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscribe to our newsletter</li>
                <li>Register for an account</li>
                <li>Post comments on our blog</li>
                <li>Contact us through our contact form</li>
                <li>Participate in surveys or contests</li>
              </ul>
              <p>This information may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Username</li>
                <li>Profile picture (if you choose to upload one)</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                2.2 Automatically Collected Information
              </h3>
              <p>
                When you visit our website, we automatically collect certain
                information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring website</li>
                <li>Pages visited on our site</li>
                <li>Date and time of visits</li>
                <li>Time spent on pages</li>
                <li>Links clicked</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                2.3 Cookies and Tracking Technologies
              </h3>
              <p>
                We use cookies, web beacons, and similar tracking technologies
                to collect information about your browsing activities. For
                detailed information about our use of cookies, please see our{" "}
                <a
                  href="/cookie-policy"
                  className="text-primary hover:underline"
                >
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                3. How We Use Your Information
              </h2>
              <p>We use the collected information for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>To provide and maintain our service:</strong>{" "}
                  Including monitoring usage and improving our website
                </li>
                <li>
                  <strong>To manage your account:</strong> Process your
                  registration and manage your user profile
                </li>
                <li>
                  <strong>To send newsletters:</strong> Deliver content updates,
                  articles, and announcements you've subscribed to
                </li>
                <li>
                  <strong>To respond to inquiries:</strong> Answer your
                  questions and provide customer support
                </li>
                <li>
                  <strong>To moderate comments:</strong> Review and manage
                  user-generated content on our blog
                </li>
                <li>
                  <strong>To analyze usage:</strong> Understand how visitors use
                  our website to improve content and user experience
                </li>
                <li>
                  <strong>To display advertisements:</strong> Show relevant ads
                  through Google AdSense and other advertising partners
                </li>
                <li>
                  <strong>To prevent fraud:</strong> Detect and prevent
                  fraudulent activities and abuse
                </li>
                <li>
                  <strong>To comply with legal obligations:</strong> Respond to
                  legal requests and prevent harm
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                4. Third-Party Services and Advertising
              </h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                4.1 Google AdSense
              </h3>
              <p>
                We use Google AdSense to display advertisements on our website.
                Google AdSense uses cookies to serve ads based on your prior
                visits to our website or other websites. Google's use of
                advertising cookies enables it and its partners to serve ads
                based on your visit to our site and/or other sites on the
                Internet.
              </p>
              <p>
                You may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>{" "}
                or by visiting{" "}
                <a
                  href="http://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.aboutads.info
                </a>
                .
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                4.2 Analytics Services
              </h3>
              <p>
                We may use third-party analytics services to monitor and analyze
                website traffic. These services may use cookies and similar
                technologies to collect information about your use of our
                website.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                4.3 Social Media Features
              </h3>
              <p>
                Our website may include social media features such as share
                buttons. These features may collect your IP address and set
                cookies. Social media features are either hosted by a third
                party or hosted directly on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                5. Data Sharing and Disclosure
              </h2>
              <p>We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>With service providers:</strong> We may share
                  information with third-party vendors who perform services on
                  our behalf (e.g., email service providers, hosting services)
                </li>
                <li>
                  <strong>For legal reasons:</strong> We may disclose
                  information if required by law or if we believe disclosure is
                  necessary to protect our rights or comply with legal
                  proceedings
                </li>
                <li>
                  <strong>Business transfers:</strong> If we are involved in a
                  merger, acquisition, or sale of assets, your information may
                  be transferred as part of that transaction
                </li>
                <li>
                  <strong>With your consent:</strong> We may share information
                  for any other purpose with your explicit consent
                </li>
              </ul>
              <p className="mt-3">
                <strong>
                  We do not sell your personal information to third parties.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy. We will retain and use your information to comply with
                legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <p>
                When we no longer need your information, we will securely delete
                or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure password storage using encryption</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal information</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to protect
                your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                8. Your Privacy Rights
              </h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Right to access:</strong> Request a copy of the
                  personal information we hold about you
                </li>
                <li>
                  <strong>Right to rectification:</strong> Request correction of
                  inaccurate or incomplete information
                </li>
                <li>
                  <strong>Right to erasure:</strong> Request deletion of your
                  personal information
                </li>
                <li>
                  <strong>Right to restrict processing:</strong> Request that we
                  limit how we use your information
                </li>
                <li>
                  <strong>Right to data portability:</strong> Request transfer
                  of your information to another service
                </li>
                <li>
                  <strong>Right to object:</strong> Object to processing of your
                  information for certain purposes
                </li>
                <li>
                  <strong>Right to withdraw consent:</strong> Withdraw consent
                  for processing based on consent
                </li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the
                information provided in the Contact section below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                9. Children's Privacy
              </h2>
              <p>
                Our website is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us,
                and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                10. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and maintained on
                computers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ. By using our website, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                11. Do Not Track Signals
              </h2>
              <p>
                Some browsers include a "Do Not Track" feature. Our website does
                not currently respond to Do Not Track signals. However, you can
                manage cookies and tracking through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                12. Links to Other Websites
              </h2>
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to review the privacy policies of any
                third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                13. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for legal, operational, or
                regulatory reasons. We will notify you of any material changes
                by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>
                  Sending an email notification to registered users (for
                  significant changes)
                </li>
              </ul>
              <p className="mt-3">
                We encourage you to review this Privacy Policy periodically.
                Your continued use of the website after changes are posted
                constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li>
                  <strong>Email:</strong> privacy@sparkzonn.com
                </li>
                <li>
                  <strong>Contact Form:</strong>{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    https://sparkzonn.com/contact
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                We will respond to your inquiry within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                15. California Privacy Rights (CCPA)
              </h2>
              <p>
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>
                  Right to know whether your information is sold or disclosed
                </li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to deletion of your personal information</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
              <p className="mt-3">
                <strong>Note:</strong> We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                16. European Users (GDPR)
              </h2>
              <p>
                If you are located in the European Economic Area (EEA), you have
                rights under the General Data Protection Regulation (GDPR). We
                process your data based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Consent:</strong> When you provide explicit consent
                  (e.g., newsletter subscription)
                </li>
                <li>
                  <strong>Contract:</strong> To fulfill our contractual
                  obligations
                </li>
                <li>
                  <strong>Legitimate interests:</strong> For our business
                  operations and improvements
                </li>
                <li>
                  <strong>Legal obligations:</strong> To comply with applicable
                  laws
                </li>
              </ul>
              <p className="mt-3">
                You have the right to lodge a complaint with your local data
                protection authority if you believe we have not complied with
                GDPR.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
