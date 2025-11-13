import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Sparkzonn</h3>
            <p className="text-muted-foreground">Premium insights on technology, lifestyle, and innovation.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-foreground transition">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-foreground transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-foreground transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-center text-muted-foreground text-sm">© 2025 Sparkzonn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
