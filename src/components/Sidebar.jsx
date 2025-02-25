import '../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ gender }) => {  // Accept gender as a prop
    const navigate = useNavigate();

    const categories = [
        { name: 'Tricouri', value: 'TSHIRTS' },
        { name: 'Jeans', value: 'JEANS' },
        { name: 'Shorts', value: 'SHORTS' },
        { name: 'Blugi', value: 'PANTS' },
        { name: 'Genti', value: 'BAGS' },
        { name: 'Topuri', value: 'TOPS' },
        { name: 'Bluze', value: 'BLOUSES' },
        { name: 'Palarii', value: 'HATS' },
        { name: 'Geci', value: 'JACKETS' },
        { name: 'Rochii', value: 'DRESS' },
        { name: 'Incaltaminte sport', value: 'SNEAKERS' },
        { name: 'Accesorii', value: 'ACCESSORIES' },
    ];

    const handleCategoryClick = (categoryValue) => {
        const currentParams = new URLSearchParams(window.location.search);

        // Handle gender
        const existingGenders = currentParams.getAll('gender');
        if (!existingGenders.includes(gender)) {
            currentParams.append('gender', gender); // Append the new gender
        }

        // Handle category
        const existingCategories = currentParams.getAll('category');
        if (!existingCategories.includes(categoryValue)) {
            currentParams.append('category', categoryValue); // Append the new category
        }

        // Update the URL with the new parameters
        navigate(`/products?${currentParams.toString()}`, { replace: true });
        window.location.reload(); //refresh page
    };

    return (
        <div className="sidebar">
            <ul>
                {categories.map((category) => (
                    <li
                        key={category.value}
                        onClick={() => handleCategoryClick(category.value)}
                        className="sidebar-item"
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
