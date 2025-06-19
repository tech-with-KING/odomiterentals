'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import GlobalHeader, { HeaderThree } from './GlobalHeader';

type ProductCardProps = {
  image: string;
  title: string;
  price: number | string;
  desc: string;
};

type ServiceCardProps = {
  image: string;
  title: string;
}

const ServiceData = [
  {
    id: "0",
    title:"Chairs",
    desc: "Transportation",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259937/projects/zpyqv0b23khpzwxgvfz2.png',
  },
  {
    id: "1",
    title:"Tables",
    service_name: "Tables",
    desc: "Professional setup for a perfect event layout.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259936/projects/ctxpkd14h3n5n1zszsop.png',
  },
  {
    id: "3",
    title:"Tents",
    service_name: "Tents",
    desc: "Stylish decor to make your event unforgettable.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270531/products/xfrudnzxqgoilpwra3ft.png',
  },
  {
    id: "5",
    service_name: "Equipments",
    title: "Equipments",
    desc: "Post-event cleanup handled with care",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259962/projects/jl4fps6ymngmshu1sd3v.png',
  }
];

const ProductData = [
  {
    id: "0",
    category: ['products', 'chairs'],
    Product_name: "Hercules Folding Chairs",
    price: 3.50,
    desc: "mahogany red",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270532/products/cqhhlipvoeg6yckbopvt.png',
    instock: true,
    unitsleft: 12
  },
  {
    id: "1",
    category: ['products', 'chairs'],
    Product_name: "Enchanted Garden Chairs",
    price: 3.99,
    desc: "white",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270531/products/xfrudnzxqgoilpwra3ft.png',
    instock: true,
    unitsleft: 5
  },
  {
    id: "2",
    category: ['products', 'tables'],
    Product_name: `Cocktail Table`,
    price: 12.00,
    desc: "Elegant Cocktail Table",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270533/products/btwbw6foiny14cq0jwhm.png',
    instock: false,
    unitsleft: 0
  },
  {
    id: "3",
    category: ['products', 'chairs'],
    Product_name: "Dainty Black Plastic Chair",
    price: 2.50,
    desc: "Top on style. With 600 pounds static weight capacity, this chair is perfect for any event.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259937/projects/zpyqv0b23khpzwxgvfz2.png',
    instock: true,
    unitsleft: 3
  },
  {
    id: "4",
    category: ['products', 'tables'],
    Product_name: "8ft long Bi-Fold Table",
    price: 15.00,
    desc: "This Sturdy Table seats 10 people conveniently and ideal for cozy close family reunion and other events. This table comes in black and off-white colors",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270533/products/giu3lm3ojqtknkjda03c.png',
    instock: true,
    unitsleft: 1
  },
  {
    id: "5",
    category: ['products', 'tents'],
    Product_name: "24' Heavy Duty 3ft speed Fan",
    price: 21.9,
    desc: "Tent Accessories",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259937/projects/p823v78rftljyvcxgabm.png',
    instock: true,
    unitsleft: 7
  },
  {
    id: "6",
    category: ['products', 'tents'],
    Product_name: "10x20 Tent ",
    price: 175.00,
    desc: "This waterproof tent comes with sidewalls and stylish counterweight at a reasonable rate without additional charges for  setup and takedown.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750262022/samples/zyzq9mvkggecloxbleie.png',
    instock: true,
    unitsleft: 4
  },
  {
    id: "7",
    category: ['products', 'chairs'],
    Product_name: "Throne Chair",
    price: 150.00,
    desc: "White and Gold- Step into luxury with our exquisite Throne Chair, designed to elevate your event's elegance. Perfect for weddings, parties, and special occasions.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750270530/products/z3pisqi7ep3uoslammpv.png',
    instock: true,
    unitsleft: 2
  },
  {
    id: "8",
    category: ['products', 'equipments'],
    Product_name: "Patio Heater",
    price: 100.00,
    desc: "These 90ft patio heaters are perfect for keeping your outdoor space warm and cozy during chilly evenings. Ideal for patios, decks, and outdoor events.",
    img: 'https://res.cloudinary.com/algopinile/image/upload/v1750259962/projects/jl4fps6ymngmshu1sd3v.png',
    instock: true,
    unitsleft: 6
  }
];

function ServiceCard({ image, title }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <Image 
          src={image} 
          alt={title}
          width={400}
          height={256}
          className="w-full h-68 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
        <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
          {`view ${title}`} 
        </button>
      </div>
      <div className="p-1 sm:p-3 md:flprice, descex md: md:flex-1 md:justify-between">
        <h3 className="text-[22px] sm:text-sm sm:font-semibold font-medium text-gray-900">{title}</h3>
      </div>
    </div>
  );
}

function ProductCard({ image, title, price }: ProductCardProps) {
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
        <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
          Book Now
        </button>
      </div>
      <div className="p-1 sm:p-3 md:flex md: md:flex-1 md:justify-between">
        <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
           <span className="text-blue-900">${price}</span> a unit
        </p>
      </div>
    </div>
  );
}

export const Products = () => {
  return (
    <div className='container mx-auto px-1 py-6 bg-white '>
      <HeaderThree title='Day Rentals' />
      <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2  md:gap-6  mx-auto'>
        {ProductData.map((item) => (
          <Link key={item.id} href={`/product/${item.Product_name}`} className="group">
            <ProductCard image={item.img} title={item.Product_name} price={item.price} desc={item.desc} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Services = () => {
  return (
    <div className='container mx-auto px-1 py-6 bg-white '>
      <HeaderThree title='Featured Cartegories' />
      <div className='w-full grid sm:grid-col-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 mx-auto'>
        {ServiceData.map((item) => (
          <Link key={item.id} href={`/product/${item.service_name}`} className="group">
            <ServiceCard image={item.img} title={item.service_name ?? ''} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Cartegories = () => {
  return (
    <div className='container mx-auto px-4 py-12 bg-white '>
      <GlobalHeader title='Day Rentals' description='our day rental products come at affodable rates' buttonHref='/products' buttonText='View More'/>
      {/* Mobile Scroll */}
      <div className='relative md:hidden'>
        <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4'>
          {ProductData.map((item) => (
          <Link key={item.id} href={`/projects/${item.Product_name}`}>
            <ProductCard  image={item.img} title={item.Product_name} price={item.price} desc={item.desc}/>
          </Link>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
        {ProductData.map((item) => (
          <Link key={item.id} href={`/product/${item.Product_name}`} className="group">
            <ProductCard image={item.img} title={item.Product_name} price={item.price} desc={item.desc} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
export {ProductCard, ProductData};