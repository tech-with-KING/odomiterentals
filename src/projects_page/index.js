import React from 'react';
import './index.css'
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion'
import {useInView} from "react-intersection-observer"
import {useAnimation} from "framer-motion"
const Projects=(props)=>{
    const [toggle,settoggle]=useState(false)
    const {ref:article_ref,inView:article_view}=useInView()
    const {ref:projec_ref,inView:project_view}=useInView()
    return(
	    <div className='project_container'>
	    			<div className='project_grid'>
				<div className='first_element'></div>
				<div></div>
				<div></div>
				<div className='view_on_vercel'>
					<button>
						View on Vercel
					</button>
					<p>
						this is a brief description of this pr
						oject that i have done
						thiis it so that it can be used to help the lifes of
						students in the universit
						y of lagos state
					</p>
					<button>
						View on Vercel
					</button>
				</div>
			</div>
			<div className='project_grid'>
				<div className='first_element'></div>
				<div></div>
				<div></div>
				<div className='view_on_vercel'>
					<button>
						View on Vercel
					</button>
					<p>
						this is a brief description of this pr
						oject that i have done
						thiis it so that it can be used to help the lifes of
						students in the universit
						y of lagos state
					</p>
					<button>
						View on Vercel
					</button>
				</div>
			</div>
		</div>
	    
    )
}
export default Projects;

