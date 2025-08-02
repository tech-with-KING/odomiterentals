"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/app/cart/page"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, Calendar, Package } from "lucide-react"

interface BookNowPopupProps {
  product: {
  id: string | number;
  images: string[];
  name: string;
  price: number | string;
  desc: string;
  categories?: string[];
  }
  trigger?: React.ReactNode
}

export const BookNowPopup = ({ product, trigger }: BookNowPopupProps) => {
  const { addToCart } = useCart()
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [duration, setDuration] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const totalPrice = Number(product.price) * quantity * duration

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // Transform the product to match the expected format
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: [product.images[0]],
        categories: product.categories || ['General']
      }
      
      await addToCart(cartProduct, quantity, duration)
      setOpen(false)
      // Reset form
      setQuantity(1)
      setDuration(1)
      // Optional: Show success toast
      console.log('Added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleDurationChange = (change: number) => {
    setDuration(Math.max(1, duration + change))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm" className="bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
            Book Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book Item</DialogTitle>
          <DialogDescription>
            Choose quantity and duration for your rental
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">${product.price} per unit</p>
              {product.desc && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.desc}
                </p>
              )}
            </div>
          </div>

          {/* Quantity and Duration Controls */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quantity */}
            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-sm font-medium flex items-center">
                <Package className="w-4 h-4 mr-1" />
                Quantity
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-9 w-9 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center h-9"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  className="h-9 w-9 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Duration (days)
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDurationChange(-1)}
                  disabled={duration <= 1}
                  className="h-9 w-9 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center h-9"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDurationChange(1)}
                  className="h-9 w-9 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Calculation */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Price per unit</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Duration</span>
                  <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-base font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">${totalPrice}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {quantity} × {duration} × ${product.price} = ${totalPrice}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Updated Product Card Component
interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  categories?: string[]
  description?: string
  onAddToCart?: () => void
}

export const ProductCard = ({ id, title, price, image, categories, description, onAddToCart }: ProductCardProps) => {
  const product = {
    id,
    images: [image],
    name: title,
    price,
    desc: description || "",
    categories
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <Image 
          src={image} 
          alt={title}
          width={400}
          height={256}
          className="w-full h-45 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
        <BookNowPopup product={product} />
      </div>
      <div className="p-1 sm:p-3 md:flex md:flex-1 md:justify-between">
        <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          <span className="text-blue-900">${price}</span> a unit
        </p>
      </div>
    </div>
  )
}

// Alternative: If you want to keep your existing component structure
export const BookNowButton = ({ product }: { product: any }) => {
  return (
    <BookNowPopup 
      product={product}
      trigger={
        <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
          Book Now
        </button>
      }
    />
  )
}