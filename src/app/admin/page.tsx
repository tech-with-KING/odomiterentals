import Link from "next/link"
import { Plus, Edit } from "lucide-react"

export default function DashBoard() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif]">
      <main className="px-4 md:px-8 lg:px-16 xl:px-40 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Product Inventory Management</h1>
          <p className="text-xl text-gray-600 mb-12">Manage your Rental inventory with ease</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="admin/inventory/add-product"
              className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plus size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Product</h3>
                <p className="text-gray-600">Create a new furniture rental listing</p>
              </div>
            </Link>
    
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Product</h3>
                <p className="text-gray-600 mb-4">Modify existing product details</p>
                <p className="text-sm text-gray-500">Navigate to a product page and add /edit to the URL</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Firebase Configuration</h4>
            <p className="text-blue-700 text-sm">
              Don't forgot to use image files that are below in size{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">200 Kilobites</code> Login with 
              your admin account to access the inventory management features.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}