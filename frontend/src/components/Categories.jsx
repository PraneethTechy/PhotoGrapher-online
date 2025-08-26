
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import wedding from "../assets/wedding,png.png";
import fashion from "../assets/fashion3.png";
import Travel from "../assets/Travel.png";
import Birthday from "../assets/Birthday.png";
import Product from "../assets/product.png";
import event from "../assets/event1.png.png";

const categories = [
  { name: "Wedding", image: wedding },
  { name: "Fashion", image: fashion },
  { name: "Travel", image: Travel },
  { name: "Birthday", image: Birthday },
  { name: "Product", image: Product },
  { name: "Event", image: event },
];

const Categories = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // If user is logged in, redirect to home page
      navigate('/home');
    }
  }, [navigate]);

  const handleCategoryClick = (categoryName) => {
    // When a category is clicked, navigate to home page with category filter
    navigate(`/home?category=${categoryName.toLowerCase()}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden shadow-md cursor-pointer"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-lg font-semibold">{cat.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Ready to find photographers?</p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
