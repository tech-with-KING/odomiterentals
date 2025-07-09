"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, LucideIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-8">
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Logo and Company Info */}
          <div className="flex flex-col gap-6 max-w-[300px]">
            <Image
              src="/logo.png"
              alt="Odomite Rental Logo"
              width={250}
              height={80}
              className="w-[250px] h-auto brightness-110"
            />
            <p className="text-lg text-gray-500 leading-relaxed italic">
              &ldquo;Your trusted evnet rental to cater to all your party needs.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold  mb-2 border-b-2 border-blue-500 pb-2 inline-block">
              Quick Links
            </h3>
            <nav>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                <li>
                  <InteractiveLink href="/about">About Us</InteractiveLink>
                </li>
                <li>
                  <InteractiveLink href="/services">Our Services</InteractiveLink>
                </li>
                <li>
                  <InteractiveLink href="/shop">Catalogue</InteractiveLink>
                </li>
                <li>
                  <InteractiveLink href="/resources">Get Quote</InteractiveLink>
                </li>
                <li>
                  <InteractiveLink href="/contact">Get In Touch</InteractiveLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold mb-2 border-b-2 border-blue-500 pb-2 inline-block">
              Contact Information
            </h3>
            <div className="flex flex-col gap-4">
              <ContactItem icon={Mail} href="mailto:odomitegroupsllc@gmail.com" type="email">
                odomitegroupsllc@gmail.com
              </ContactItem>
              <ContactItem icon={Phone} href="tell:+18622306639" type="phone">
                +18622306639
              </ContactItem>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold border-b-2 border-blue-500 pb-2 inline-block">
              Connect With Us
            </h3>
            <div className="flex flex-col gap-6">
              <p className="text-sm m-0">Follow us for updates and project showcases</p>
              <div className="flex gap-4 flex-wrap">
                <SocialIcon icon={Facebook} href="#" label="Facebook" hoverColor="#1877f2" />
                <SocialIcon icon={Instagram} href="#" label="Instagram" hoverColor="#e4405f" />

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 pt-8 border-t border-white/10">
          <p className="text-sm">© 2025 OdomiteRentals.com. All rights reserved.</p>
{/*           <div className="flex gap-8 flex-wrap">
            <BottomLink href="/privacy">Privacy Policy</BottomLink>
            <BottomLink href="/terms">Terms of Service</BottomLink>
            <BottomLink href="/sitemap">Sitemap</BottomLink>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

// Type definitions
interface InteractiveLinkProps {
  href: string;
  children: React.ReactNode;
}

interface ContactItemProps {
  icon: LucideIcon;
  href: string;
  children: React.ReactNode;
  type?: "email" | "phone" | "link";
}

interface SocialIconProps {
  icon: LucideIcon;
  href: string;
  label: string;
  hoverColor: string;
}

interface BottomLinkProps {
  href: string;
  children: string;
}

// Interactive link component
const InteractiveLink = ({ href, children }: InteractiveLinkProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className={` no-underline text-base transition-all duration-300 py-2 border-l-[3px] pl-3 block ${
        isHovered ? "text-blue-500 border-blue-500 translate-x-[5px]" : "border-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  )
}

// Interactive contact item
const ContactItem = ({ icon: Icon, href, children, type = "link" }: ContactItemProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const content = (
    <div
      className={`flex items-center gap-4 py-3 transition-all duration-300 ${isHovered ? "translate-x-[5px]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-blue-500 bg-blue-500/10 p-2 rounded-full min-w-[40px] h-[40px] flex items-center justify-center">
        <Icon size={24} />
      </div>
      <span className={`text-base transition-colors duration-300 ${isHovered ? "text-blue-500" : ""}`}>
        {children}
      </span>
    </div>
  )

  if (type === "email") {
    return (
      <a href={`mailto:${href}`} className="no-underline">
        {content}
      </a>
    )
  }
  if (type === "phone") {
    return (
      <a href={`tel:${href}`} className="no-underline">
        {content}
      </a>
    )
  }
  return <div>{content}</div>
}

// Interactive social icon
const SocialIcon = ({ icon: Icon, href, label, hoverColor }: SocialIconProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      className={`p-3 bg-white/10 rounded-full transition-all duration-300 no-underline flex items-center justify-center w-[50px] h-[50px] backdrop-blur-[10px] ${
        isHovered ? "text-white translate-y-[-3px] scale-105" : ""
      }`}
      style={{
        backgroundColor: isHovered ? hoverColor : "rgba(255, 255, 255, 0.1)",
        boxShadow: isHovered ? `0 8px 25px rgba(66, 153, 225, 0.3)` : "none",
      }}
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={24} />
    </a>
  )
}

// Interactive bottom link
const BottomLink = ({ href, children }: BottomLinkProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className={`no-underline text-sm transition-colors duration-300 ${isHovered ? "text-blue-500" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  )
}