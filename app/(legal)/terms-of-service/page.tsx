import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Sparkzonn",
  description:
    "Read the terms of service for using the Sparkzonn blog website.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using the Sparkzonn blog website, you accept
                and agree to be bound by the terms and provisions of this
                agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Sparkzonn for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Disclaimer</h2>
              <p>
                The materials on Sparkzonn are provided on an 'as is' basis.
                Sparkzonn makes no warranties, expressed or implied, and hereby
                disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability,
                fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Limitations</h2>
              <p>
                In no event shall Sparkzonn or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Sparkzonn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us through our{" "}
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
