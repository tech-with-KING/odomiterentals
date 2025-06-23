"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, X } from "lucide-react"
import Image from "next/image"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ProductData {
  name: string
  short_description: string
  description: string
  images: string[]
  dimensions: string
  material: string
  features: string
  category: string
  subcategory: string
  instock: boolean
  unitsleft: number
  price: number
}

const AddProductPage = () => {
  const router = useRouter()

  const [product, setProduct] = useState<ProductData>({
    name: "",
    short_description: "",
    description: "",
    images: [],
    dimensions: "",
    material: "",
    features: "",
    category: "",
    subcategory: "",
    instock: true,
    unitsleft: 0,
    price: 0,
  })

  const [saving, setSaving] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setProduct({ ...product, [field]: value })
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    setProduct({
      ...product,
      images: [...product.images, newImageUrl.trim()],
    })
    setNewImageUrl("")
  }

  const handleRemoveImage = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index)
    setProduct({
      ...product,
      images: newImages,
    })
    if (activeImageIndex >= newImages.length) {
      setActiveImageIndex(Math.max(0, newImages.length - 1))
    }
  }

  const handleSave = async () => {
    // Basic validation
    if (!product.name.trim()) {
      alert("Product name is required")
      return
    }
    if (!product.category.trim()) {
      alert("Category is required")
      return
    }
    if (product.images.length === 0) {
      alert("At least one image is required")
      return
    }

    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "products"), product)
      alert("Product added successfully!")
      router.push(`/products/${docRef.id}`) // Redirect to the new product page
    } catch (err) {
      console.error("Error adding product:", err)
      alert("Failed to add product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif]">
      <main className="px-4 md:px-8 lg:px-16 xl:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Product</h1>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} className="mr-2" />
                {saving ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Furniture, Decor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <input
                  type="text"
                  value={product.subcategory}
                  onChange={(e) => handleInputChange("subcategory", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chairs, Tables"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                type="text"
                value={product.short_description}
                onChange={(e) => handleInputChange("short_description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description for listings"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed product description"
              />
            </div>
          </section>

          {/* Product Images */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Images *</h3>

            {product.images.length > 0 && (
              <div className="mb-4">
                <div className="w-full bg-center bg-no-repeat bg-cover aspect-[3/2] md:aspect-[16/10] lg:aspect-[3/2] rounded-xl overflow-hidden shadow-lg relative">
                  <Image
                    src={product.images[activeImageIndex] || "/placeholder.svg"}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    unoptimized
                  />
                </div>

                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === activeImageIndex ? "border-blue-600" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product view ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Image
              </button>
            </div>
            {product.images.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">At least one image is required</p>
            )}
          </section>

          {/* Product Details */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                <input
                  type="text"
                  value={product.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 24W x 18D x 32H inches"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  value={product.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Solid wood, Metal, Fabric"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units Available</label>
                <input
                  type="number"
                  value={product.unitsleft}
                  onChange={(e) => handleInputChange("unitsleft", Number.parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <textarea
                value={product.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List key features, separated by commas or bullet points"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.instock}
                  onChange={(e) => handleInputChange("instock", e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </label>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AddProductPage
