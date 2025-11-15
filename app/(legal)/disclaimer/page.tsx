import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Sparkzonn",
  description:
    "Read our cookie policy to understand how we use cookies on our website.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">
                General Disclaimer
              </h2>
              <p>
                Sparkzonn blog is provided on an "as-is" basis. While we strive
                to provide accurate and up-to-date information, we make no
                representations or warranties of any kind, express or implied,
                about the completeness, accuracy, reliability, suitability, or
                availability with respect to the website or the information,
                products, services, or related graphics contained on the website
                for any purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">External Links</h2>
              <p>
                Sparkzonn may contain links to external websites. We are not
                responsible for the content, accuracy, or practices of external
                sites. Your use of external websites is at your own risk and
                subject to their terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                Limitation of Liability
              </h2>
              <p>
                In no event shall Sparkzonn, its owners, or employees be liable
                for any damages arising out of or in connection with the use of
                the website or its content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Content Accuracy</h2>
              <p>
                While we endeavor to keep the content up-to-date and accurate,
                we do not warrant the completeness, timeliness, or accuracy of
                information provided. Information may change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact</h2>
              <p>
                If you have any questions about this disclaimer, please contact
                us through our{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
