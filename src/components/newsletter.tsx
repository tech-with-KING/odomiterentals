import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function NewsletterSection() {
  return (
    <section className="bg-[#bcd1e5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay in the Loop</h2>

        <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
          Get updates on our latest promotions, new arrivals, and exclusive offers directly to your inbox.
          Join our newsletter and be the first to know about everything happening at Odomite Rentals
        </p>

        <div className="max-w-md mx-auto">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full h-12 px-4 text-base rounded-full"
                required
              />
            </div>
            <Button type="submit" className="h-12 px-8 text-base font-medium whitespace-nowrap rounded-full">
              Subscribe Now
            </Button>
          </form>

          <p className="text-sm text-gray-700 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
