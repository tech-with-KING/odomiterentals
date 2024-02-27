import './body.css'
import Slide_Bar from "../components/slidder/slidebar"
import HeaderBanner from '../components/bonus_products';
import { Email, Facebook, Google, Instagram, Mail, Phone, Twitter, WhatsApp } from '@mui/icons-material';
import ProductCard from '../components/shoppingCard/card';
import Header from './header';
import { products } from '../deviceinfo';
import { motion } from 'framer-motion'
import BankAccounts from '../components/slidder_downbar';
import PromotionaPage from './promotion';
const Body=(props)=>{
  return(
	<div className='hero'>
	
	  <HeroImage />
	  <Brands  />
	   <Header
        heading="Chairs"
        paragraph="Our Chairs Comes in great variations"
      />	  
	  <ProductCard cart="Chair" products={products}/>
	  <Header
        heading="Tables and Table Covers"
        paragraph="Tables Comes in all sizes for any number of Guests"
      />	  
	  <ProductCard cart="Table" products={products}/>
	  <PromotionaPage />
	  
	  <Header
        heading="Tents"
        paragraph="10 X 10, 20 X 10 and more"
      />	  
	  <ProductCard cart="Tent" products={products}/>
	  <Header
        heading="Children's Rental"
        paragraph="10 X 10, 20 X 10 and more"
      />	  
	  <ProductCard cart="Kids" products={products}/>
	  <HeaderBanner />
	  <PromotionaPage />
      <BankAccounts />
      <GetNewsLetter />
	</div>
  )
}

const HeroImage = (props)=>{
  return(
	<div className="hero_img">
	  <Slide_Bar />
	</div>
  )
}
const Brands = (props)=>{
  const animae = [
	{
		id: 1,
		color: 'about_heading',
		link: 'https://wa.me/c/18622306639',
		item: <Phone style={{ color: '#00ACEE' }}/>
	},
	{
		id: 2,
		color: 'about_heading',
		link: 'https://wa.me/c/18622306639',
		item: <WhatsApp style={{ color: '#00ACEE' }} />,
	},
	{
		id: 3,
		color: 'about_heading',
		link: 'https://wa.me/c/18622306639',
		item: <Google style={{ color: '#DB4437' }} />

	},

	{
		id: 4,
		color: 'about_heading',
		link: 'https://odomietegroupsllc@gmail.com',
		item: <Email style={{ color: '#0072b1' }} />
	},
	{
		id: 5,
		color: 'about_heading',
		link: 'https://wa.me/c/18622306639',
		item: <Instagram style={{ color: '#FF0000' }} />
	}
]
  return(
	<div className="brands_">
	  <div className='fav_brands'>
		<h1>
		  REACH US ON THESE PLATFORMS
		</h1>
	  </div>
	  <div className='logos'>
			{
				animae.map((anim, i) => {
					return (
						<motion.a href={anim.link} className='circle_brand'
							key={anim.id}
							initial={{ opacity: 0, translateX: -40 }}
							animate={{ opacity: 1, translateX: 0 }}
							transition={{ duration: 0.5, delay: i * 0.5 }}
						>{anim.item}</motion.a>
					)
				})
			}
	  </div>
	  <div>

	  </div>
	</div>
  )
}
const GetNewsLetter = (props)=>{
  return(
	<div className="news_letter">
	  <p>Get On our mailing list for great offers before your next event</p>
	  <div className='input_container'>
		<input placeholder='your email '/><button>Suscribe</button>
	  </div>
	</div>
  )
}
export default Body;
