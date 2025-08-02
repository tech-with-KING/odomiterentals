'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import GlobalHeader, { HeaderThree } from './GlobalHeader';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust the import path to your Firebase config
import { CartProvider, useCart } from '@/app/cart/page';
import { BookNowPopup } from './ui/BookNowPopUp';

type ProductCardProps = {
  id: string | number;
  images: string[];
  name: string;
  price: number | string;
  desc: string;
  categories?: string[];
};

type ServiceCardProps = {
  image: string;
  title: string;
}

// Define proper types for your product data from Firestore
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

interface Service {
  id: string | number;
  img: string[];
  name: string;
  desc: string;
}

function ServiceCard({ image, title }: ServiceCardProps) {
  // Convert title to URL-friendly format for category filtering
  const categorySlug = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <Image 
          src={image} 
          alt={title}
          width={300}
          height={256}
          className="w-full h-68 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
        <Link href={`/shop/cartegory/${categorySlug}`}>
          <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
            {`view ${title}`} 
          </button>
        </Link>
      </div>
      <div className="p-1 sm:p-3 md:flprice, descex md: md:flex-1 md:justify-between">
        <h3 className="text-[22px] sm:text-sm sm:font-semibold font-medium text-gray-900">{title}</h3>
      </div>
    </div>
  );
}

function ProductCard({ images, name, price, id, categories, desc}: ProductCardProps) {
  const product = {
  id: id ,
  name: name,
  price: price,
  images: images,
  desc: desc,
  categories: categories
  }
  const {addToCart} =  useCart()
    const handleAddToCart = () => {
    addToCart(product, 1, 5) // quantity: 1, duration: 5 days
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <Image 
          src={images[0]} 
          alt={name}
          width={400}
          height={256}
          className="w-full h-45 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
      <BookNowPopup 
          product={product}
          trigger={
            <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
              Book Now
            </button>
          }
          />
      </div>
      <div className="p-1 sm:p-3 md:flex md: md:flex-1 md:justify-between">
        <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
           <span className="text-blue-500 font-bold m-2 ">${price}</span> a unit
        </p>
      </div>
      <Link key={id} href={`/shop/${id}`} className="group">
        <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900 hover:text-blue-600 ml-2">View Details</h3>
      </Link>
    </div>
  );
}

// Custom hook for fetching products
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
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
            id: doc.id,
            images,
            name,
            price: data.price || 0,
            desc: data.desc || data.description || '',
            categories
          };
        });
        
        setProducts(productsData);
        console.log('Fetched products:', productsData);
        console.log('Raw Firestore data:', productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

const useServices = () => {
  const [services, setServices] = useState<Service[]>([
  {
    id: 'chairs',
    name: 'Chairs',
    desc: 'A wide variety of chairs including stackables, padded, and folding for all event styles.',
    img: ['https://res.cloudinary.com/algopinile/image/upload/v1750259937/projects/zpyqv0b23khpzwxgvfz2.png'] // White Stackable Chairs
  },
  {
    id: 'tables',
    name: 'Tables',
    desc: 'Durable rectangular and round tables suitable for banquets, meetings, and more.',
    img: ['https://res.cloudinary.com/algopinile/image/upload/v1750270533/products/giu3lm3ojqtknkjda03c.png'] // Rectangular 6ft Table
  },
  {
    id: 'tents',
    name: 'Tents',
    desc: 'High-quality tents available in various sizes to provide cover and elegance at your event.',
    img: ['https://res.cloudinary.com/algopinile/image/upload/v1750262022/samples/zyzq9mvkggecloxbleie.png'] // 10 by 10 Tent White
  },
  {
    id: 'table-covers',
    name: 'Table Covers',
    desc: 'Stylish table covers including damask and sequin options to complete your table setup.',
    img: ['https://res.cloudinary.com/dpcvlheu9/image/upload/v1754159285/black_table_covers_m89oif.webp']
  },
  {
    id: 'equipment',
    name: 'Equipment',
    desc: 'Essential event accessories and equipment for lighting, sound, and functionality.',
    img: ['https://res.cloudinary.com/algopinile/image/upload/v1750259937/projects/p823v78rftljyvcxgabm.png'] 
  },
  {
    id: 'Kids Rentals',
    name: 'Kids Rentals',
    desc: 'Ambient and decorative lighting to brighten up your indoor or outdoor events.',
    img: ['https://res.cloudinary.com/dpcvlheu9/image/upload/v1754044209/kids_chair_alt_wk7frd.webp'] 
  }
]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesCollection = collection(db, 'categories');
        const servicesSnapshot = await getDocs(servicesCollection);
        
        if (servicesSnapshot.docs.length > 0) {
          const servicesData: Service[] = servicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Service, 'id'>
          }));
          
          setServices(servicesData);
          console.log('Fetched services from Firebase:', servicesData);
        } else {
          console.log('No services found in Firebase, using default services');
          // Keep the hardcoded services as fallback
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        console.log('Using default services due to error');
        setError(null); // Don't show error, just use default services
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};

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

export const Products = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className='container mx-auto px-1 py-6 bg-white'>
        <HeaderThree title='Day Rentals' />
        <LoadingGrid cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-1 py-6 bg-white'>
        <HeaderThree title='Day Rentals' />
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-1 py-6 bg-white '>
      <HeaderThree title='Day Rentals' />
      <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2  md:gap-6  mx-auto'>
        {products.map((item: Product) => (
            <ProductCard 
              key={item.id}
              images={item.images || ''} 
              name={item.name} 
              price={item.price} 
              categories={item.categories}
              id={item.id}
              desc={item.desc} 
            />
        ))}
      </div>
    </div>
  );
};

export const Services = () => {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className='container mx-auto px-1 py-12 bg-white'>
        <HeaderThree title='Featured Categories' />
        <LoadingGrid cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-1 py-12 bg-white'>
        <HeaderThree title='Featured Categories' />
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-1 py-12 bg-white '>
      <HeaderThree title='Featured Categories' />
      <div className='w-full grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 mx-auto'>
        {services.map((item) => (
          <div key={item.id}>
            <ServiceCard 
              image={item.img[0] || ''} 
              title={item.name} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Categories = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-12 bg-white'>
        <GlobalHeader 
          title='Day Rentals' 
          description='our day rental products come at affordable rates' 
          buttonHref='/products' 
          buttonText='View More'
        />
        <LoadingGrid cols={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12 bg-white'>
        <GlobalHeader 
          title='Day Rentals' 
          description='our day rental products come at affordable rates' 
          buttonHref='/products' 
          buttonText='View More'
        />
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12 bg-white '>
      <GlobalHeader 
        title='Day Rentals' 
        description='our day rental products come at affordable rates' 
        buttonHref='/products' 
        buttonText='View More'
      />
      
      {/* Mobile Scroll */}
      <div className='relative md:hidden'>
        <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4'>
          {products.map((item) => (
            <Link key={item.id} href={`/projects/${item.name}`}>
              <ProductCard  
                id={item.id}
                images={item.images || []} 
                name={item.name} 
                price={item.price} 
                desc={item.desc}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
        {products.map((item) => (
          <Link key={item.id} href={`/product/${item.name}`} className="group">
            <ProductCard 
              id={item.id}
              images={item.images || []} 
              name={item.name} 
              price={item.price} 
              desc={item.desc} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
export { ProductCard };