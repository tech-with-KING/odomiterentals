import React from 'react';
import './card.css'
import img from './assets/forest-resized.jpg'
import { Chair, Home } from '@mui/icons-material';
import { Table } from '@mui/material';

const ProductCard = () => {
  return (
    <>
      <div className="shop_list">
        <div>
            <h3>Categories </h3>
            <ul>
                <li><Home /><button>Chairs</button></li>
                <li><Table /><button>Tables</button></li>
                <li><Home /><button>Tents</button></li>
                <li><Chair /><button>Chairs</button></li>
                
            </ul>
        </div>
{/* cards contents  */}
<ul class="cards">
            <li>
                <div class="card-content" style="background-image: url('assets/forest-resized.jpg');">
                </div>
            </li>
            <li>
                <div class="card-content" style="background-image: url('assets/lavender-field-resized.jpg');">
                </div>
            </li>
            <li>
                <div class="card-content" style="background-image: url('assets/wooden-bridge-resized.jpg');">
                </div>
            </li>
        </ul>
      </div>
    </>
  );
};

export default ProductCard;
