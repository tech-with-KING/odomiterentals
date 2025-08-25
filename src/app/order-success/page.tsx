"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Mail, MessageCircle, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderSuccessPage() {
  const router = useRouter()
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    // Animation delay
    const timer = setTimeout(() => {
      setOrderComplete(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full transition-all duration-1000 ${
            orderComplete ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Success Card */}
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">
              Order Submitted Successfully! 🎉
            </CardTitle>
            <p className="text-lg text-slate-600">
              Thank you for choosing our rental service
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                What happens next?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">1</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900">Order Confirmation</h4>
                    <p className="text-blue-800 text-sm">
                      We've sent a confirmation email with your order details
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">2</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900">Email Contact</h4>
                    <p className="text-blue-800 text-sm">
                      We'll contact you via email to confirm details and availability
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">3</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900">Payment & Delivery</h4>
                    <p className="text-blue-800 text-sm">
                      We'll arrange payment and schedule delivery/pickup
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Need immediate assistance?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WhatsApp contact removed. Only email shown. */}
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">We'll message you soon. Check your inbox for updates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => router.push('/')}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Home
              </Button>
              
              <Button
                onClick={() => router.push('/shop')}
                variant="outline"
                className="flex-1 h-12"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Additional Note */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>Note:</strong> Please check your email for updates. 
                We typically respond within 1-2 hours during business hours.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
