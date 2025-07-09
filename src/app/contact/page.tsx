"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, Globe, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MapIntegration from "@/components/map-intergration"
import NewsletterSection from "@/components/newsletter"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    projectType: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form or show success message
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">Get in Touch</h1>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Planning an event? We’re here to help. Whether you need chairs, tents, or full event setup, Odomite Rentals has you covered. Reach out today to get a quote, check availability, or learn how we can help make your occasion unforgettable."

Let me know if you want a more casual, formal, or playful tone
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16 ">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
             <p className="text-sm text-gray-600 mb-2">Mon, Wed, Sat, Tue: 6 AM – 8:30 PM ET</p>
              <p className="text-sm text-gray-600 mb-2">Thursday: 6 AM – 8 PM ET</p>
              <p className="text-sm text-gray-600 mb-2">Friday: 8 AM – 9 PM ET</p>
              <p className="text-sm text-gray-600 mb-2">Sunday: 9 AM – 8 PM ET</p>

              <a href="tel:+1-555-123-4567" className="text-blue-600 hover:text-blue-700 font-medium">
                +1 (555) 123-4567
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600 mb-2">We&apos;ll respond within an hour</p>
              <a href="mailto:odomitegroupsllc@gmail.com" className="text-green-600 hover:text-green-700 font-medium">
            
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-2">Available 24/7</p>
              <button className="text-purple-600 hover:text-purple-700 font-medium">Start Chat</button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Book a Call</h3>
              <p className="text-sm text-gray-600 mb-2">30-min consultation</p>
              <button className="text-orange-600 hover:text-orange-700 font-medium">Schedule Now</button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-12 lg:mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name / Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="E.g. John Events or XYZ Planners"
                    />
                  </div>
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                      Rental Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a rental type</option>
                      <option value="chairs">Chairs</option>
                      <option value="tables">Tables</option>
                      <option value="tents">Tents/Canopies</option>
                      <option value="coolers">Coolers</option>
                      <option value="decor">Decor Items</option>
                      <option value="combo">Full Event Package</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>


              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                  placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Office Locations */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">New Jersey Address</h3>
                    <p className="text-gray-700 mb-2">
                      331 Seymour Ave
                      <br />
                       Newark, NJ 07112
                      <br />
                      United States
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Mon-Fri: 9:00 AM - 6:00 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Globe className="w-5 h-5 text-purple-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">Serving New Jersey Area</h3>
      <p className="text-gray-700 mb-2">
        Odomite Rentals delivers and sets up event essentials across New Jersey, call and we’ll be there.
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>Timely Setup & Support</span>
      </div>
    </div>
  </div>
</div>

              </div>
            </div>

            {/* Map Integration */}
            
          </div>
        </div>  
        <div className="rounded-xl overflow-hidden mb-6">
            <MapIntegration />
        </div>
        {/* FAQ Section */}
<section className="mb-12 lg:mb-16">
  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-2">How soon can I get my rental items delivered?</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        Most orders can be delivered within 24-48 hours, depending on availability and location. We also accommodate same-day or next-day rentals for urgent events.
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-2">What items do you rent out?</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        We offer a wide range of party rentals including chairs, tables, tents, canopies, coolers, and decor. If you need something specific, feel free to ask—we’re always expanding our inventory.
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-2">Do you handle setup and takedown?</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        Yes! Our team offers full setup and takedown services for tents, chairs, and tables, so you can focus on your event while we handle the logistics.
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-2">What if something gets damaged or I need to cancel?</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        We understand that plans can change. Cancellations made 48 hours in advance are fully refundable. Minor damages are covered under our rental protection plan, and we’re always here to work with you on any issues.
      </p>
    </div>
  </div>
</section>

      </div>
      <NewsletterSection />
    </div>
  )
}