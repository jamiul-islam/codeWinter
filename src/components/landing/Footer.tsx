import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-primary/10 bg-surface/50 relative border-t backdrop-blur">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Social
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary text-sm transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-16 md:flex-row">
          {/* <div className="text-sm text-muted">
            © {new Date().getFullYear()} codeWinter. All rights reserved.
          </div> */}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 w-full -translate-x-1/2 overflow-hidden">
        <div
          className="text-primary/5 text-center text-[180px] leading-none font-bold whitespace-nowrap md:text-[220px]"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          codeWinter
        </div>
      </div>
    </footer>
  )
}
