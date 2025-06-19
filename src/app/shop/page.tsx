'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, ProductData } from '@/components/Products';

// Define proper types for your product data
interface Product {
  id: string | number;
  img: string;
  Product_name: string;
  price: number | string;
  desc: string;
  categories?: string[];
}

const ShopPage = () => {
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
      products={ProductData}
      onFilterChange={(selectedCategories) => {
        // You can handle the filter change here if needed
        console.log('Selected categories:', selectedCategories);
      }}
    />
  );
};

export default ShopPage;

interface CategoryFilterProps {
  title?: string;
  categories: string[];
  products: Product[];
  className?: string;
  onFilterChange?: (selectedCategories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title = 'Filter by Product Type',
  categories,
  products,
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
          selectedCategories.includes(category)
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

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 pb-4 ${className}`}>
      <h2 className="text-3xl sm:text-4xl font-medium text-center text-gray-800 my-8">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-[#bcd1e5] text-grey-900 '
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard 
              image={product.img} 
              title={product.Product_name} 
              price={product.price} 
              desc={product.desc} 
            />
          </Link>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products match the selected filters.</p>
        </div>
      )}
    </div>
  );
};