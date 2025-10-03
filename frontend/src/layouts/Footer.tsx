import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer7 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  sections = defaultSections,
  description = "A collection of components for your startup business or side project.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Shadcnblocks.com. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Top: Logo + Description + Social */}
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* === MODIFIED SECTION === */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 w-full lg:w-1/3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href={logo.url}>
                <img src={logo.src} alt={logo.alt} title={logo.title} className="h-8" />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            {/* Description */}
            <p className="text-muted-foreground max-w-full sm:max-w-[70%] text-sm">
              {description}
            </p>
            {/* Social Links */}
            <ul className="flex items-center space-x-4 sm:space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          {/* === MODIFIED SECTION === */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 lg:gap-20 w-full">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="hover:text-primary font-medium">
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Legal + Copyright */}
        <div className="mt-8 border-t pt-8 flex flex-col gap-4 text-xs text-muted-foreground font-medium md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-col gap-2 md:flex-row md:gap-4">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
          <p className="w-full md:w-auto">{copyright}</p>
        </div>
      </div>
    </section>
  );
};

export default Footer7;