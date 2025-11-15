import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Sparkzonn",
  description:
    "Read our cookie policy to understand how we use cookies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or
                mobile device when you visit a website. They are widely used to
                make websites work more efficiently as well as to provide
                information to the website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Cookies We Use</h2>
              <p>Sparkzonn uses the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookie Consent:</strong> To remember your cookie
                  preferences
                </li>
                <li>
                  <strong>Authentication:</strong> To maintain your login
                  session
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how visitors use our
                  website
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                Your Cookie Choices
              </h2>
              <p>
                Most web browsers allow some control of most cookies through the
                browser settings. To find out more about cookies, including how
                to see what cookies have been set and how to manage and delete
                them, please visit www.allaboutcookies.org.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Cookie Policy, please
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
