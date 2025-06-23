import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                You need to be signed in as admin to access this page
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Please sign in with your account to continue</p>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 my-auto" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
