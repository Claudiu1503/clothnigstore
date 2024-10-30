import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/adminProducts.css';

const categories = [
    "TSHIRTS", "JEANS", "SHORTS", "PANTS", "BAGS", "TOPS",
    "BLOUSES", "HATS", "JACKETS", "DRESS", "SNEAKERS", "ACCESSORIES"
];

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: null,
        name: '',
        category: 'TSHIRTS',
        price: '',
        quantity: 0,
        shortDescription: '',
        longDescription: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            alert('Access Denied! Only admins can access this page.');
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/product/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`${user.email}:${localStorage.getItem('password')}`)}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const method = newProduct.id ? 'PUT' : 'POST';
            const url = newProduct.id ? `http://localhost:8080/product/update/${newProduct.id}` : 'http://localhost:8080/product/create';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${btoa(`${user.email}:${localStorage.getItem('password')}`)}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                resetForm();
                fetchProducts();
            } else {
                console.error('Failed to add or update product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditProduct = (product) => {
        setNewProduct(product);
    };

    const resetForm = () => {
        setNewProduct({
            id: null,
            name: '',
            category: 'TSHIRTS',
            price: '',
            quantity: 0,
            shortDescription: '',
            longDescription: ''
        });
    };

    return (
        <div className="admin-products-page">
            <h2>Admin Products</h2>
            <form className="add-product-form" onSubmit={handleAddProduct}>
                <h3>{newProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
                <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                    required
                />
                <input
                    type="text"
                    placeholder="Short Description"
                    value={newProduct.shortDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Long Description"
                    value={newProduct.longDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
                />
                <button type="submit">{newProduct.id ? 'Update Product' : 'Add Product'}</button>
                {newProduct.id && (
                    <button type="button" className="cancel-button" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </form>

            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card" onClick={() => handleEditProduct(product)}>
                        <h3>{product.name}</h3>
                        <p>Category: {product.category}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>{product.shortDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProductsPage;
