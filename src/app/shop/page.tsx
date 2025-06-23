'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/Products';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust the import path to your Firebase config
import { HeaderThree } from '@/components/GlobalHeader';

// Define proper types for your product data
interface Product {
  id: string | number;
  images: string[];
  name: string;
  price: number | string;
  desc: string;
  categories?: string[];
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
);

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        console.log('Raw Firestore data:', productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const productsData: Product[] = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          let images: string[] = [];
          if (data.images && Array.isArray(data.images)) {
            images = data.images;
          } else if (data.img && typeof data.img === 'string') {
            images = [data.img];
          } else if (data.image && typeof data.image === 'string') {
            images = [data.image];
          }
          
          // Handle different possible field names for name
          const name = data.name || data.Product_name || data.title || 'Unnamed Product';
          
          // Handle different possible field names for categories
          let categories: string[] = [];
          if (data.categories && Array.isArray(data.categories)) {
            categories = data.categories;
          } else if (data.category && Array.isArray(data.category)) {
            categories = data.category;
          } else if (typeof data.category === 'string') {
            categories = [data.category];
          }
          
          return {
            id: doc.id,
            images,
            name,
            price: data.price || 0,
            desc: data.desc || data.description || '',
            categories
          };
        });
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <CategoryFilter
      title="Filter by Product Type"
      categories={[
        'chairs',
        'tables',
        'tents',
        'equipments',
        'services',
        'products',
        'transportation',
        'setup',
        'decoration',
      ]}
      products={products}
      loading={loading}
      error={error}
      onFilterChange={(selectedCategories) => {
        console.log('Selected categories:', selectedCategories);
      }}
    />
  );
};

// Category Filter Component
interface CategoryFilterProps {
  title?: string;
  categories: string[];
  products: Product[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onFilterChange?: (selectedCategories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title = 'Filter by Product Type',
  categories,
  products,
  loading = false,
  error = null,
  className = '',
  onFilterChange,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product: Product) => {
        const productCategories = product.categories || [];
        return productCategories.some((category: string) =>
          selectedCategories.includes(category.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    }
    if (onFilterChange) onFilterChange(selectedCategories);
  }, [selectedCategories, products, onFilterChange]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };
console.log('Filtered products:', filteredProducts);
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 pb-4 ${className}`}>
      {/* Filter Section */}
      <h2 className="text-3xl sm:text-4xl font-medium text-center text-gray-800 my-8">
        {title}
      </h2>
      
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-full border transition-colors capitalize ${
              selectedCategories.includes(category)
                ? 'bg-[#bcd1e5] text-grey-900'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Section */}
      <div className='container mx-auto px-1 py-6 bg-white'>
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
        
          {!loading && !error && (
          <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 mx-auto'>
            {filteredProducts.map((item: Product) => (
              <Link key={item.id} href={`/shop/${item.id}`} className="group">
                <ProductCard 
                  image={item.images[0] || ''} 
                  title={item.name} 
                  price={item.price} 
                  desc={item.desc} 
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* No Results Message */}
      {!loading && !error && filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products match the selected filters.</p>
        </div>
      )}

      {/* No Products Message */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products available at the moment.</p>
          <p className="text-sm text-gray-500">
            Debug: Check browser console for Firestore data structure
          </p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;