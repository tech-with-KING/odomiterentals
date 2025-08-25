"use client"
import { useState, useRef } from "react"
import { categories } from "@/data"
import { useRouter } from "next/navigation"
import { Save, Plus, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { validateImageFiles, getImageAcceptTypes, getSupportedFormatsString } from "@/lib/imageUtils"

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
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  console.log('Cloudinary Config:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    hasCloudName: !!CLOUDINARY_CLOUD_NAME,
    hasUploadPreset: !!CLOUDINARY_UPLOAD_PRESET
  })

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
  const [uploading, setUploading] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setProduct({ ...product, [field]: value })
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Check if configuration is available
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error('Cloudinary configuration missing:', {
        cloudName: !!CLOUDINARY_CLOUD_NAME,
        uploadPreset: !!CLOUDINARY_UPLOAD_PRESET
      })
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.')
    }

    console.log('Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    // Log form data contents
    console.log('FormData contents:')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value === 'string' ? value : `File: ${file.name}`)
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
    console.log('Upload URL:', uploadUrl)

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      console.log('Upload response status:', response.status)
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('Upload response text:', responseText)

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error?.message || errorData.message || errorMessage
          console.error('Cloudinary error details:', errorData)
        } catch {
          console.error('Raw response:', responseText)
        }
        throw new Error(errorMessage)
      }

      const data = JSON.parse(responseText)
      console.log('Upload successful:', {
        publicId: data.public_id,
        secureUrl: data.secure_url,
        format: data.format,
        bytes: data.bytes
      })
      
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }
      throw new Error('Failed to upload image: Unknown error')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Validate files using utility function
    const validation = validateImageFiles(files)
    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file))
      const imageUrls = await Promise.all(uploadPromises)
      
      setProduct({
        ...product,
        images: [...product.images, ...imageUrls]
      })
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      alert(`Successfully uploaded ${imageUrls.length} image(s)!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    
    // Basic URL validation
    try {
      new URL(newImageUrl.trim())
      
      // Check if the URL is already in the list
      if (product.images.includes(newImageUrl.trim())) {
        alert("This image URL is already added")
        return
      }
      
      setProduct({
        ...product,
        images: [...product.images, newImageUrl.trim()],
      })
      setNewImageUrl("")
    } catch (error) {
      alert("Please enter a valid URL")
    }
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
    // Enhanced validation
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
    if (product.price <= 0) {
      alert("Price must be greater than 0")
      return
    }
    if (product.unitsleft < 0) {
      alert("Units available cannot be negative")
      return
    }

    if (!user?.emailAddresses?.[0]?.emailAddress) {
      alert("User email not found. Please make sure you're logged in.")
      return
    }

    setSaving(true)
    try {
      // Clean the product data before saving
      const productToSave = {
        ...product,
        name: product.name.trim(),
        category: product.category.trim(),
        subcategory: product.subcategory.trim(),
        short_description: product.short_description.trim(),
        description: product.description.trim(),
        features: product.features.trim(),
        dimensions: product.dimensions.trim(),
        material: product.material.trim()
      }

      // Use API route to create product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
          productData: productToSave
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      const result = await response.json()
      console.log('Create result:', result)
      
      alert("Product added successfully!")
      
      // Redirect to inventory page
      router.push("/admin/inventory")
    } catch (err) {
      console.error("Error adding product:", err)
      if (err instanceof Error) {
        alert(`Failed to add product: ${err.message}`)
      } else {
        alert("Failed to add product. Please try again.")
      }
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
                <select
                  value={product.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
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

            {/* Upload Section */}
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={getImageAcceptTypes()}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Upload size={16} className="mr-2" />
                    )}
                    {uploading ? "Uploading..." : "Upload Images"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple images to upload to Cloudinary. Supported formats: {getSupportedFormatsString()} (Max 10MB per file)
                </p>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or Add Image URL</label>
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
                    Add URL
                  </button>
                </div>
              </div>
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
