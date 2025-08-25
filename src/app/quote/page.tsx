"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderThree } from '@/components/GlobalHeader'

interface Product {
  id: string | number
  images: string[]
  name: string
  price: number
  desc: string
  categories?: string[]
}

interface ProductCardProps {
  product: Product
  quantity: number
  onQuantityChange: (id: string | number, quantity: number) => void
}

// Loading component
const LoadingGrid = ({ cols = 4 }: { cols?: number }) => (
  <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-2 md:gap-6`}>
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="bg-gray-200 animate-pulse rounded-xl">
        <div className="h-64 bg-gray-300 rounded-xl mb-2"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
)

function QuoteProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
  const handleIncrease = () => {
    onQuantityChange(product.id, quantity + 1)
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input for better UX while typing
    if (value === "") {
      onQuantityChange(product.id, 0)
      return
    }

    // Only allow positive integers
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      onQuantityChange(product.id, numValue)
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ensure we have a valid number when input loses focus
    const value = e.target.value
    if (value === "" || isNaN(Number.parseInt(value))) {
      onQuantityChange(product.id, 0)
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={256}
          className="w-full h-45 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="p-1 sm:p-3">
        {/* Product title and price - matching ProductCard design */}
        <div className="md:flex md:flex-1 md:justify-between mb-4">
          <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900">{product.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            <span className="text-blue-900">${product.price}</span> a unit
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={quantity || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-12 h-8 text-center font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="0"
            />
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {quantity > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="font-semibold text-blue-900">${(product.price * quantity).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GetQuotePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string | number, number>>({})

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const productsData: Product[] = await response.json()
        
        console.log('Products from API:', productsData)
        
        setProducts(productsData)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleQuantityChange = (id: string | number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }))
  }

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0
      return total + product.price * quantity
    }, 0)
  }

  const getTotalItems = () => {
    return Object.values(quantities).reduce((total, quantity) => total + quantity, 0)
  }

  const getSelectedProducts = () => {
    return products.filter((product) => (quantities[product.id] || 0) > 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Your Quote</h1>
          <p className="text-gray-600">Select the services you need and see your total in real-time</p>
        </div>

        {/* Products Section with same styling as ShopPage */}
        <div className='container mx-auto px-1 py-6 bg-white rounded-xl mb-8'>
          <HeaderThree title='Quality Items Tailored To Your Event' />
          
          {/* Loading State */}
          {loading && <LoadingGrid cols={4} />}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Products Grid */}
          {!loading && !error && (
            <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 mx-auto'>
              {products.map((product) => (
                <QuoteProductCard
                  key={product.id}
                  product={product}
                  quantity={quantities[product.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          )}

          {/* No Products Message */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products available at the moment.</p>
            </div>
          )}
        </div>

        {/* Quote Summary */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getTotalItems() === 0 ? (
                <p className="text-gray-500 text-center py-4">No items selected</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {getSelectedProducts().map((product) => {
                      const quantity = quantities[product.id]
                      const subtotal = product.price * quantity
                      return (
                        <div key={product.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {quantity} × ${product.price}
                            </p>
                          </div>
                          <p className="font-semibold">${subtotal.toFixed(2)}</p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-blue-900">${calculateTotal().toFixed(2)}</span>
                    </div>

                    <Button className="w-full" size="lg">
                      Request Quote
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}