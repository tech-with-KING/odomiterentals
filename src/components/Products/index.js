import React, { useState } from 'react';
import './index.css';

const ProductUpload = ({ existingProduct, onSave }) => {
    const [product, setProduct] = useState(existingProduct || {
        id: null,
        category: '',
        productName: '',
        spec: '',
        price: '',
        desc: '',
        img: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setProduct(prevState => ({
            ...prevState,
            img: e.target.files[0]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product);
    };

    return (
        <div className="product-upload">
            <h2>{product.id ? 'Update Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Product Name:
                    <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Specification:
                    <input
                        type="text"
                        name="spec"
                        value={product.spec}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Price:
                    <input
                        type="text"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="desc"
                        value={product.desc}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Image:
                    <input
                        type="file"
                        name="img"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </label>

                <button type="submit">
                    {product.id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductUpload;
