'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/Products';
import { HeaderThree } from '@/components/GlobalHeader';

interface Product {
  id: string | number;
  images: string[];
  name: string;
  price: number | string;
  desc: string;
  categories?: string[];
  instock?: boolean;
  unitsleft?: number;
}

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
);

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.cartegory as string;
  
  // Convert slug back to category name
  const categoryName = categorySlug
    ? categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryName) return;
      
      try {
        setLoading(true);
        
        // Use API route instead of direct Firestore access
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const { products: allProducts } = await response.json();
        
        // Filter products by category
        const filteredProducts: Product[] = allProducts
          .map((data: any) => {
            let images: string[] = [];
            if (data.images && Array.isArray(data.images)) {
              images = data.images;
            } else if (data.img && typeof data.img === 'string') {
              images = [data.img];
            } else if (data.image && typeof data.image === 'string') {
              images = [data.image];
            }

            const name = data.name || data.Product_name || data.title || 'Unnamed Product';
            let categories: string[] = [];
            if (data.categories && Array.isArray(data.categories)) {
              categories = data.categories;
            } else if (data.category && Array.isArray(data.category)) {
              categories = data.category;
            } else if (typeof data.category === 'string') {
              categories = [data.category];
            }
            
            return {
              id: data.id,
              images,
              name,
              price: data.price || 0,
              desc: data.desc || data.description || '',
              categories
            };
          })
          .filter((product: Product) => {
            // Check if product matches the category
            if (!product.categories || product.categories.length === 0) return false;
            
            // Check for exact match or partial match (case insensitive)
            return product.categories.some((cat: string) => 
              cat.toLowerCase().includes(categoryName.toLowerCase()) ||
              categoryName.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().replace(/s$/, '') === categoryName.toLowerCase().replace(/s$/, '') // Handle plural/singular
            );
          });
        
        setProducts(filteredProducts);
        console.log(`Filtered products for category "${categoryName}":`, filteredProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products for this category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-6 bg-white min-h-screen'>
        <HeaderThree title={`${categoryName} - Loading...`} />
        <LoadingGrid cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-6 bg-white min-h-screen'>
        <HeaderThree title={`${categoryName} - Error`} />
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6 bg-white min-h-screen'>
      <HeaderThree title={`${categoryName} Rentals`} />
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">
            No products found in "{categoryName}" category
          </h3>
          <p className="text-gray-500">
            Try browsing our other categories or check back later.
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'} in {categoryName}
          </p>
          
          <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mx-auto'>
            {products.map((item: Product) => (
              <ProductCard 
                key={item.id}
                images={item.images} 
                name={item.name} 
                price={item.price} 
                categories={item.categories}
                id={item.id}
                desc={item.desc} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
