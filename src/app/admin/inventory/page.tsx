'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Package, Search, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductData {
  id: string; // This will be the Firebase document ID
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

const InventoryPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use API route to fetch products
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const { products: rawProducts } = await response.json()
        
        // Using the same mapping approach as your shop page
        const productsData: ProductData[] = rawProducts.map((data: any) => {
          return {
            id: data.id, // Firebase document ID - same as shop page
            name: data.name || data.Product_name || 'Unnamed Product',
            short_description: data.short_description || data.desc || data.description || '',
            description: data.description || data.desc || '',
            images: Array.isArray(data.images) ? data.images : (data.img ? [data.img] : (data.image ? [data.image] : [])),
            dimensions: data.dimensions || '',
            material: data.material || '',
            features: data.features || '',
            category: data.category || '',
            subcategory: data.subcategory || '',
            rating: data.rating || 0,
            instock: data.instock !== undefined ? data.instock : true,
            unitsleft: data.unitsleft || 0,
            price: data.price || 0
          };
        });
        
        console.log('Inventory products with Firebase IDs:', productsData.map(p => ({ id: p.id, name: p.name })));
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Stock filter
    if (stockFilter === 'instock') {
      filtered = filtered.filter(product => product.instock && product.unitsleft > 0);
    } else if (stockFilter === 'outofstock') {
      filtered = filtered.filter(product => !product.instock || product.unitsleft === 0);
    } else if (stockFilter === 'lowstock') {
      filtered = filtered.filter(product => product.instock && product.unitsleft <= 10 && product.unitsleft > 0);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, stockFilter]);

  const handleEditProduct = (productId: string) => {
    console.log('Editing product with Firebase ID:', productId);
    router.push(`/admin/inventory/edit_product/${productId}`);
  };

  const getUniqueCategories = () => {
    const categories = products.map(product => product.category).filter(cat => cat);
    return [...new Set(categories)];
  };

  const getStockStatus = (product: ProductData) => {
    if (!product.instock || product.unitsleft === 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    } else if (product.unitsleft <= 10) {
      return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',_'Noto_Sans',_sans-serif] ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 md:px-8 lg:px-16 xl:px-40 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={24} />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
              </div>
              <div className="text-sm text-gray-600">
                {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        </div>
        <DashBoard />
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-4 lg:px-8 xl:px-10 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stock Status</option>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg mb-2">No products found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                      {/* Stock Status Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {product.category} {product.subcategory && `/ ${product.subcategory}`}
                        </p>
                      </div>

                      {/* Firebase ID Display (for debugging) */}
                      <p className="text-xs text-gray-400 mb-2">
                        ID: {product.id}
                      </p>

                      {/* Price and Stock Info */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {product.unitsleft} units
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {product.short_description}
                      </p>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit Product
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;

function DashBoard() {
  return (
    <div className="w-full">
      <Link
        href="/admin/inventory/add_product"
        className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <Plus size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Product</h3>
          <p className="text-gray-600">Create a new furniture rental listing</p>
        </div>
      </Link>
    </div>
  );
}