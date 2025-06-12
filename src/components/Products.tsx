import Link from 'next/link';
import React from 'react';
import GlobalHeader from './GlobalHeader';
type ProductCardProps = {
  image: string;
  title: string;
  price: number | string; // depending on how you handle price
  altText: string;
};

const ProductData = [
  {
    id: "0",
    category: ['Bathroom', 'Main Floor'],
    Product_name: "Elegant Bathroom Vanity",
    price: 299.99,
    desc: "Modern bathroom vanity with granite countertop and under-mount sink.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 12
  },
  {
    id: "1",
    category: ['Kitchen', 'Main Floor'],
    Product_name: "Granite Kitchen Countertop",
    price: 899.00,
    desc: "Premium granite countertop perfect for kitchen islands and counters.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 5
  },
  {
    id: "4",
    category: ['Exterior', 'Whole Home'],
    Product_name: "Exterior Wall Cladding",
    price: 450.75,
    desc: "Durable exterior wall cladding panels for home renovation projects.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: false,
    unitsleft: 0
  },
  {
    id: "2",
    category: ['Addition', 'Exterior'],
    Product_name: "Modular Home Extension Kit",
    price: 1599.00,
    desc: "Comprehensive kit for modular home additions and expansions.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 3
  },
  {
    id: "3",
    category: ['Whole Home', 'Kitchen', 'Bathroom'],
    Product_name: "Complete Home Renovation Package",
    price: 7999.99,
    desc: "All-in-one package for whole-home remodeling including kitchen and bathroom.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 1
  },
  {
    id: "5",
    category: ['Basement', 'Addition'],
    Product_name: "Basement Finishing Kit",
    price: 2100.49,
    desc: "Kit with insulation, flooring, and walls for finishing your basement.",
    img: 'https://media.istockphoto.com/id/149060607/photo/for-rent-sign-in-front-of-new-house.jpg?s=612x612&w=0&k=20&c=By627yICPZugFR1j2_a_7MCEn1f5ltYlivg6Tv50JaQ=',
    instock: true,
    unitsleft: 7
  },
];

// Individual Product Card Component
function ProductCard({ image, title, price,  altText }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative rounded-lg">
        <img 
          src={image} 
          alt={altText}
          className="w-full h-84 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
        />
        <button className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
          Book Now
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">${price}</span>
        </div>
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
		<div className='container mx-auto px-4 py-12 bg-white '>
			<GlobalHeader title='Day Rentals' description='our day rental products come at affodable rates' buttonHref='/products' buttonText='View More'/>
			{/* Mobile Scroll */}
			<div className='relative md:hidden'>
				<div className='flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4'>
					{ProductData.map((item, index) => (
					<Link key={item.id} href={`/projects/${item.Product_name}`}>
						<ProductCard  image={item.img} title={item.Product_name} price={item.price} altText={item.img}/>
					</Link>
					))}
				</div>
			</div>

			{/* Desktop Grid */}
			<div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
				{ProductData.map((item, index) => (
					<Link key={item.id} href={`/product/${item.Product_name}`} className="group">
						<ProductCard image={item.img} title={item.Product_name} price={item.price} altText={item.img} />
					</Link>
				))}
			</div>
		</div>
	);
};

export default Products;
