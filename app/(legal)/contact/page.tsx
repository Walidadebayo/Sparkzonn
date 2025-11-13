import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ContactPage from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact Us | Sparkzonn",
  description:
    "Get in touch with the Sparkzonn team for any inquiries or support.",
};

export default function page() {

  return (
    <>
      <Header />
      <ContactPage />
      <Footer />
    </>
  );
}
