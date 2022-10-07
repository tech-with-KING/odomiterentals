import React, { Component } from 'react';
import './bob.css'
import bob from './img.JPG'
class Carded extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        
    }
    
    render() { 
        return ( 
        <>
            <div class="container_" style={{width:'400px'}}>
                <div class="card_">
                    <div class="card__header">
                        <div className='project_img' style={{backgroundImage:`url(${this.props.img})`}}></div>
                    </div>
                    <div class="card__body_">
                <span class="tag tag-red" >react</span>
                    <h4>Making Emacs Into An IDE</h4>
                    <p style={{margin:'5px'}}>Loestiae ihil! At ea atque quidem!</p>
                    </div>
                    <div class="card__footer">
                        
                
                    </div>
                </div>
            </div>
        </>
         );
    }
}
 
export default Carded;
