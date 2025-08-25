'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface ProductData {
  id: string;
  name: string;
  short_description: string;
  description: string;
  images: string[];
  dimensions: string;
  material: string;
  features: string;
  category: string;
  subcategory: string;
  rating: number;
  instock: boolean;
  unitsleft: number;
  price: number;
}

const ShopPage = () => {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        // Use API route instead of direct Firestore access
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.ok) {
          const { product: productData } = await response.json();
          setProduct({
            id: productData.id,
            name: productData.name || productData.Product_name || 'Unnamed Product',
            short_description: productData.short_description || productData.desc || productData.description || '',
            description: productData.description || productData.desc || '',
            images: Array.isArray(productData.images) ? productData.images : (productData.img ? [productData.img] : (productData.image ? [productData.image] : [])),
            dimensions: productData.dimensions || '',
            material: productData.material || '',
            features: productData.features || '',
            category: productData.category || '',
            subcategory: productData.subcategory || '',
            rating: productData.rating || 0,
            instock: productData.instock !== undefined ? productData.instock : true,
            unitsleft: productData.unitsleft || 0,
            price: productData.price || 0
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-4">{error || 'Product not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif]">
      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-16 xl:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 p-4 text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              {product.category}
            </a>
            <span className="text-blue-600">/</span>
            <span className="text-gray-900 font-medium">{product.subcategory}</span>
          </nav>

          {/* Product Header */}
          <div className="px-4 mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl">
              {product.description}
            </p>
          </div>

          {/* Product Images */}
          <div className="px-4 mb-8">
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-[3/2] md:aspect-[16/10] lg:aspect-[3/2] rounded-xl overflow-hidden shadow-lg relative">
              <Image 
                src={product.images[activeImageIndex]} 
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
                unoptimized
              />
            </div>
            
            {/* Image Thumbnails (if multiple images) */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === activeImageIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 px-4 pb-4">Product Details</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {[
                { label: "Dimensions", value: product.dimensions },
                { label: "Material", value: product.material },
                { label: "Features", value: product.features },
              ].map((detail, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ${index !== 3 ? 'border-b border-gray-100' : ''}`}>
                  <p className="text-gray-600 text-sm font-medium md:col-span-1">{detail.label}</p>
                  <p className="text-gray-900 text-sm md:col-span-3">{detail.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 px-4 mb-8">
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex-1 sm:flex-none">
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </button>
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 text-gray-900 text-sm font-bold hover:bg-gray-200 transition-colors flex-1 sm:flex-none">
              <MessageSquare size={16} className="mr-2" />
              Request a Quote
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;