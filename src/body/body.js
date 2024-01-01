import './body.css'
import Slide_Bar from "../components/slidder/slidebar"
import HeaderBanner from '../components/bonus_products';
import { Email, Facebook, Google, Instagram, Mail, Phone, Twitter, WhatsApp } from '@mui/icons-material';
import ProductCard from '../components/shoppingCard/card';
import Header from './header';
import { device } from '../deviceinfo';
import CustomerReviews from '../components/reviews';
import { motion } from 'framer-motion'
const Body=(props)=>{
  return(
	<div className='hero'>
	
	  <HeroImage />
	  <Brands  />
	   <Header
        heading="Chairs"
        paragraph="Our Chairs Comes in great variations"
      />	  
	  <ProductCard devices={device}/>
	  <Header
        heading="Tents	"
        paragraph="10X10 20X20 and more"
      />	  
	  <ProductCard devices={device}/>
	  <Header
        heading="Chairs"
        paragraph="Tables in all sizes for any number of guest"
      />	  
	  <ProductCard devices={device}/>
	  <HeaderBanner />
	  	<ProductCard devices={device}/>
	  <HeaderBanner />
      <CustomerReviews />
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
		item: <Phone style={{ color: '#00ACEE' }}/>
	},
	{
		id: 2,
		color: 'about_heading',
		item: <WhatsApp style={{ color: '#00ACEE' }} />,
	},
	{
		id: 3,
		color: 'about_heading',
		item: <Google style={{ color: '#DB4437' }} />

	},

	{
		id: 4,
		color: 'about_heading',
		item: <Email style={{ color: '#0072b1' }} />
	},
	{
		id: 5,
			   color: 'about_heading',
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
						<motion.div href="#" className='circle_brand'
							key={anim.id}
							initial={{ opacity: 0, translateX: -40 }}
							animate={{ opacity: 1, translateX: 0 }}
							transition={{ duration: 0.5, delay: i * 0.5 }}
						>{anim.item}</motion.div>
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
