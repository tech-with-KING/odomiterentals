import React from 'react';
import './index.css'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useInView } from "react-intersection-observer"
import APP from "./code_block"
import { useAnimation } from "framer-motion"
const Articles = (props) => {
	const [toggle, settoggle] = useState(false)
	const { ref: article_ref, inView: article_view } = useInView()
	const { ref: projec_ref, inView: project_view } = useInView()
	return (
		<div className='article_container'>
		<div className='_article_div'>
		<h3>this is for objective c</h3>
		<p>
		my name is kingsley and this is my coding blog i have been able to see ways i could reach out to a large market of developers out there in the world to share great content with people who are in need of this contents
	    Note that the development build is not optimized.
		To create a production build, use npm run build.
		Note that the development build is not optimized.
		To create a production build, use npm run build.
		Note that the development build is not optimized.
		To create a production build, use npm run build.;
		</p>
				<APP />
	
			</div>
			<div className='_menue'>
				<ul>
					<li>this day in june</li>
					<li> this day in may</li>
					<li> from home with love</li>
					<li> fight for your right</li>
				</ul>
			</div>


		</div>
	)
}
export default Articles;


