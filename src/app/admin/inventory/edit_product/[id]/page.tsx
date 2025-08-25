'use client';
import { useState, useEffect, useRef } from "react"
import { categories } from "@/data"
import { useParams, useRouter } from "next/navigation"
import { Save, X, Plus, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { validateImageFiles, getImageAcceptTypes, getSupportedFormatsString } from "@/lib/imageUtils"

interface ProductData {
  id: string
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
  // Add these fields to handle potential data structure variations
  desc?: string
  Product_name?: string
  rating?: number
}

const EditProductPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const productId = params?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [newImageUrl, setNewImageUrl] = useState("")

  // Cloudinary configuration - replace with your values
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset'

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID not found")
        setLoading(false)
        return
      }

      try {
        console.log('Fetching product with ID:', productId)
        
        // Use API route to fetch product
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        
        const { product: rawData } = await response.json()
        console.log('Raw product data:', rawData)
        
        // Handle data mapping similar to your shop page
        const productData: ProductData = {
          id: rawData.id,
          name: rawData.name || rawData.Product_name || 'Unnamed Product',
          short_description: rawData.short_description || rawData.desc || rawData.description || '',
          description: rawData.description || rawData.desc || '',
          images: Array.isArray(rawData.images) ? rawData.images : (rawData.img ? [rawData.img] : (rawData.image ? [rawData.image] : [])),
          dimensions: rawData.dimensions || '',
          material: rawData.material || '',
          features: rawData.features || '',
          category: rawData.category || '',
          subcategory: rawData.subcategory || '',
          instock: rawData.instock !== undefined ? rawData.instock : true,
          unitsleft: rawData.unitsleft || 0,
          price: rawData.price || 0,
          rating: rawData.rating || 0
        }
        
        console.log('Mapped product data:', productData)
        setProduct(productData)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    if (!product) return
    setProduct({ ...product, [field]: value })
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !product) return

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
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddImageUrl = () => {
    if (!product || !newImageUrl.trim()) return
    setProduct({
      ...product,
      images: [...product.images, newImageUrl.trim()],
    })
    setNewImageUrl("")
  }

  const handleRemoveImage = (index: number) => {
    if (!product) return
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
    if (!product || !user?.emailAddresses?.[0]?.emailAddress) {
      alert("User email not found. Please make sure you're logged in.")
      return
    }

    setSaving(true)
    try {
      console.log('Saving product:', product)
      
      // Prepare the data to save (exclude the id field)
      const { id, ...productDataToSave } = product
      
      // Ensure all required fields are present and properly typed
      const cleanedData = {
        name: productDataToSave.name || '',
        short_description: productDataToSave.short_description || '',
        description: productDataToSave.description || '',
        images: productDataToSave.images || [],
        dimensions: productDataToSave.dimensions || '',
        material: productDataToSave.material || '',
        features: productDataToSave.features || '',
        category: productDataToSave.category || '',
        subcategory: productDataToSave.subcategory || '',
        instock: Boolean(productDataToSave.instock),
        unitsleft: Number(productDataToSave.unitsleft) || 0,
        price: Number(productDataToSave.price) || 0,
        rating: Number(productDataToSave.rating) || 0
      }
      
      // Use API route to update product
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
          productData: cleanedData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      const result = await response.json()
      console.log('Update result:', result)
      
      alert("Product updated successfully!")
      // Optionally redirect back to inventory
      // router.push('/admin/inventory')
    } catch (err) {
      console.error("Error updating product:", err)
      
      // More detailed error handling
      if (err instanceof Error) {
        alert(`Failed to update product: ${err.message}`)
      } else {
        alert("Failed to update product. Please check the console for details.")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-4">{error || "Product not found"}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif]">
      <main className="px-4 md:px-8 lg:px-16 xl:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600 mt-1">Product ID: {product.id}</p>
            </div>
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </section>

          {/* Product Images */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Images</h3>

            {product.images.length > 0 && (
              <div className="mb-4">
                <div className="w-full bg-center bg-no-repeat bg-cover aspect-[3/2] md:aspect-[16/10] lg:aspect-[3/2] rounded-xl overflow-hidden shadow-lg relative">
                  <Image
                    src={product.images[activeImageIndex] || "/placeholder.svg"}
                    alt={product.name}
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
                          alt={`${product.name} view ${index + 1}`}
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
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Add URL
                  </button>
                </div>
              </div>
            </div>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  value={product.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units Left</label>
                <input
                  type="number"
                  value={product.unitsleft}
                  onChange={(e) => handleInputChange("unitsleft", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default EditProductPage