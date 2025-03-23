import React, { useState, useEffect } from 'react';
import './main.css';

// Dummy function to simulate fetching products
const fetchProducts = async (searchQuery) => {
    // Replace this with actual API call
    return [
        { id: 0, category: 'Stackable Chair', productName: 'White Stackable Chairs', spec: '6', price: '$5', desc: 'White Padded Chairs Strictly for indoor events', img: null },
        // Add more products for testing
    ].filter(product => product.productName.toLowerCase().includes(searchQuery.toLowerCase()));
};

const ProductUpdatePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            const results = await fetchProducts(searchQuery);
            setProducts(results);
        };
        loadProducts();
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleUpdate = (updatedProduct) => {
        // Replace this with actual API call to update the product
        console.log('Updating product:', updatedProduct);
        alert('Product updated successfully!');
    };

    return (
        <div className="product-update-page">
            <h1>Update Product</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div
                            key={product.id}
                            className="product-item"
                            onClick={() => handleProductSelect(product)}
                        >
                            {product.productName}
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
            {selectedProduct && (
                <ProductUpload
                    existingProduct={selectedProduct}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};

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
                    />
                </label>

                <button type="submit">
                    {product.id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductUpdatePage;
