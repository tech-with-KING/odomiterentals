'use client';
import Link from 'next/link';
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
  price: number | string;
  desc: string;
}
const ServiceData = [
  {
    id: "0",
    category: ['Bathroom', 'Main Floor'],
    Product_name: "Chairs",
    price: 299.9,
    desc: "Modern bathroom",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 12
  },
  {
    id: "1",
    category: ['Kitchen', 'Main Floor'],
    Product_name: "Tables",
    price: 899.0,
    desc: "Premium granite countertop",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 5
  },
  {
    id: "4",
    category: ['Exterior', 'Whole Home'],
    Product_name: "Tents",
    price: 450.7,
    desc: "Durable exterior wall .",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: false,
    unitsleft: 0
  },
  {
    id: "3",
    category: ['Exterior', 'Whole Home'],
    Product_name: "Kids Rental",
    price: 450.7,
    desc: "Durable exterior wall .",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: false,
    unitsleft: 0
  }
];

const ProductData = [
  {
    id: "0",
    category: ['Bathroom', 'Main Floor'],
    Product_name: "Bathroom Vanity",
    price: 299.9,
    desc: "Modern bathroom",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 12
  },
  {
    id: "1",
    category: ['Kitchen', 'Main Floor'],
    Product_name: "Granite Kitchen",
    price: 899.0,
    desc: "Premium granite countertop",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 5
  },
  {
    id: "4",
    category: ['Exterior', 'Whole Home'],
    Product_name: "Exterior",
    price: 450.7,
    desc: "Durable exterior wall .",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: false,
    unitsleft: 0
  },
  {
    id: "2",
    category: ['Addition', 'Exterior'],
    Product_name: "Modulart",
    price: 159.0,
    desc: "Comprehensive kit for",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 3
  },
  {
    id: "3",
    category: ['Whole Home', 'Kitchen', 'Bathroom'],
    Product_name: "Complete Home ",
    price: 790.9,
    desc: "All-in-one package for ",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 1
  },
  {
    id: "5",
    category: ['Basement', 'Addition'],
    Product_name: "Basement ",
    price: 21.9,
    desc: "Kit with insulation.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 7
  },
];


function ServiceCard({ image, title, price, desc }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <img 
          src={image} 
          alt={title}
          className="w-full h-45 md:h-64 object-cover rounded-2xl transition-transform duration-300 transform hover:scale-105"
        />
        <button className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 text-xs rounded-full font-medium hover:bg-gray-100 transition-colors">
          {`view ${title}`} 
        </button>
      </div>
      <div className="p-1 sm:p-3 md:flex md: md:flex-1 md:justify-between">
        <h3 className="text-[16px] sm:text-sm sm:font-semibold font-medium text-gray-900">{title}</h3>
      </div>
    </div>
  );
}

function ProductCard({ image, title, price, desc }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto">
      <div className="relative rounded-2xl">
        <img 
          src={image} 
          alt={title}
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
	const galleryItems = ProductData.map((item) => ({
		id: item.id,
		image: item.img,
		title: item.Product_name,
		price: item.price,
		altText: item.Product_name,
	}));
	return (
		<div className='container mx-auto px-1 py-6 bg-white '>
			<HeaderThree title='Day Rentals' />
			<div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2  md:gap-6  mx-auto'>
				{ProductData.map((item, index) => (
					<Link key={item.id} href={`/product/${item.Product_name}`} className="group">
						<ProductCard image={item.img} title={item.Product_name} price={item.price} desc={item.desc} />
					</Link>
				))}
			</div>
		</div>
	);
};

export const Services = () => {
	const galleryItems = ServiceData.map((item) => ({
		id: item.id,
		image: item.img,
		title: item.Product_name,
		price: item.price,
		altText: item.Product_name,
	}));
	return (
		<div className='container mx-auto px-1 py-6 bg-white '>
			<HeaderThree title='Featured Cartegories' />
			<div className='w-full grid sm:grid-col-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 mx-auto'>
				{ServiceData.map((item, index) => (
					<Link key={item.id} href={`/product/${item.Product_name}`} className="group">
						<ServiceCard image={item.img} title={item.Product_name} price={item.price} desc={item.desc} />
					</Link>
				))}
			</div>
		</div>
	);
};
export const Cartegories = () => {
	const galleryItems = ProductData.map((item) => ({
		id: item.id,
		image: item.img,
		title: item.Product_name,
		price: item.price,
		altText: item.Product_name,
	}));
	return (
		<div className='container mx-auto px-4 py-12 bg-white '>
			<GlobalHeader title='Day Rentals' description='our day rental products come at affodable rates' buttonHref='/products' buttonText='View More'/>
			{/* Mobile Scroll */}
			<div className='relative md:hidden'>
				<div className='flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4'>
					{ProductData.map((item, index) => (
					<Link key={item.id} href={`/projects/${item.Product_name}`}>
						<ProductCard  image={item.img} title={item.Product_name} price={item.price} desc={item.desc}/>
					</Link>
					))}
				</div>
			</div>

			{/* Desktop Grid */}
			<div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
				{ProductData.map((item, index) => (
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