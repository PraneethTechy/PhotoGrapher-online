import React, { useState } from 'react';

const UserProfile = () => {
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', category, city, price);
    };

    const featuredVideographers = [
        { name: 'John Doe', city: 'New York', image: '/images/videographer1.jpg' },
        { name: 'Jane Smith', city: 'Los Angeles', image: '/images/videographer2.jpg' },
        { name: 'Mike Johnson', city: 'Chicago', image: '/images/videographer3.jpg' },
        { name: 'Sarah Lee', city: 'Boston', image: '/images/videographer4.jpg' },
        { name: 'John Doe', city: 'New York', image: '/images/videographer1.jpg' },
        { name: 'Jane Smith', city: 'Los Angeles', image: '/images/videographer2.jpg' },
        { name: 'Mike Johnson', city: 'Chicago', image: '/images/videographer3.jpg' },
        { name: 'Sarah Lee', city: 'Boston', image: '/images/videographer4.jpg' },
        { name: 'John Doe', city: 'New York', image: '/images/videographer1.jpg' },
        { name: 'Jane Smith', city: 'Los Angeles', image: '/images/videographer2.jpg' },
        { name: 'Mike Johnson', city: 'Chicago', image: '/images/videographer3.jpg' },
        { name: 'Sarah Lee', city: 'Boston', image: '/images/videographer4.jpg' },
    ];

    const featuredPhotographers = [
        { name: 'Alice Brown', city: 'Miami', image: '/images/photographer1.jpg' },
        { name: 'Bob Green', city: 'Houston', image: '/images/photographer2.jpg' },
        { name: 'Emma White', city: 'San Francisco', image: '/images/photographer3.jpg' },
        { name: 'Tom Harris', city: 'Seattle', image: '/images/photographer4.jpg' },
        { name: 'John Doe', city: 'New York', image: '/images/videographer1.jpg' },
        { name: 'Jane Smith', city: 'Los Angeles', image: '/images/videographer2.jpg' },
        { name: 'Mike Johnson', city: 'Chicago', image: '/images/videographer3.jpg' },
        { name: 'Sarah Lee', city: 'Boston', image: '/images/videographer4.jpg' },
        { name: 'John Doe', city: 'New York', image: '/images/videographer1.jpg' },
        { name: 'Jane Smith', city: 'Los Angeles', image: '/images/videographer2.jpg' },
        { name: 'Mike Johnson', city: 'Chicago', image: '/images/videographer3.jpg' },
        { name: 'Sarah Lee', city: 'Boston', image: '/images/videographer4.jpg' },
    ];

    return (
        <>
            <div className="bg-gray-800 flex flex-col items-center">
                {/* Hero / Search Section */}
                <div className="h-[480px] w-full flex justify-center items-center px-6 md:px-0">
                    <div className="w-full max-w-7xl bg-red-500 rounded-3xl shadow-2xl p-16 flex flex-col items-center text-white">
                        <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-lg">
                            Find Photographers & Videographers
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 mb-12 text-center">
                            Browse, select, and book your preferred professionals in your city with ease.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex-1 bg-white bg-opacity-20 text-black placeholder-black border border-white/40 rounded-2xl px-6 py-4 backdrop-blur-sm text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                            >
                                <option value="">Select Category</option>
                                <option value="wedding">Wedding</option>
                                <option value="birthday">Birthday</option>
                                <option value="fashion">Fashion</option>
                                <option value="events">Events</option>
                                <option value="travel">Travel</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Enter City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="flex-1 bg-white bg-opacity-20 text-black placeholder-black border border-white/40 rounded-2xl px-6 py-4 backdrop-blur-sm text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                            />

                            <input
                                type="text"
                                placeholder="Enter Price Range"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="flex-1 bg-white bg-opacity-20 text-black placeholder-black border border-white/40 rounded-2xl px-6 py-4 backdrop-blur-sm text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                            />

                            <button
                                onClick={handleSearch}
                                className="bg-white text-gray-800 font-bold px-8 py-4 rounded-2xl text-lg md:text-xl hover:bg-purple-600 hover:text-white transition shadow-lg"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="w-full max-w-7xl px-6 md:px-0 py-24 flex flex-col items-center mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">
                    How It Works
                </h2>
                <div className="w-full grid md:grid-cols-3 gap-12 ">
                    <div className="bg-red-400 rounded-3xl shadow-xl p-10 flex flex-col items-center text-white hover:scale-105 transition transform">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-bold mb-4">Search</h3>
                        <p className="text-center text-lg text-white/90">
                            Browse a wide range of professionals based on your city and category.
                        </p>
                    </div>

                    <div className="bg-red-400 rounded-3xl shadow-xl p-10 flex flex-col items-center text-white hover:scale-105 transition transform">
                        <div className="text-6xl mb-6">📸</div>
                        <h3 className="text-2xl font-bold mb-4">Pick a Studio</h3>
                        <p className="text-center text-lg text-white/90">
                            Review profiles, portfolios, and ratings to select the perfect professional.
                        </p>
                    </div>

                    <div className="bg-red-400 rounded-3xl shadow-xl p-10 flex flex-col items-center text-white hover:scale-105 transition transform">
                        <div className="text-6xl mb-6">📅</div>
                        <h3 className="text-2xl font-bold mb-4">Book</h3>
                        <p className="text-center text-lg text-white/90">
                            Send a booking request and enjoy professional services hassle-free.
                        </p>
                    </div>
                </div>
            </div>

           {/* Featured Videographers - Horizontal Scroll */}
<div className="w-full max-w-7xl px-6 md:px-0 py-16 mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-purple-400 text-center mb-6">
        Featured Videographers
    </h2>
    <div className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scrollbar-hide">
        {featuredVideographers.map((vid, idx) => (
            <div
                key={idx}
                className="min-w-[250px] snap-start bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-white hover:scale-105 transition transform"
            >
                <img src={vid.image} alt={vid.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold mb-1 text-purple-200">{vid.name}</h3>
                <p className="text-white/80">{vid.city}</p>
            </div>
        ))}
    </div>
</div>

{/* Featured Photographers - Horizontal Scroll */}
<div className="w-full max-w-7xl px-6 md:px-0 py-16 mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-purple-400 text-center mb-6">
        Featured Photographers
    </h2>
    <div className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scrollbar-hide">
        {featuredPhotographers.map((photo, idx) => (
            <div
                key={idx}
                className="min-w-[250px] snap-start bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-white hover:scale-105 transition transform"
            >
                <img src={photo.image} alt={photo.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold mb-1 text-purple-200">{photo.name}</h3>
                <p className="text-white/80">{photo.city}</p>
            </div>
        ))}
    </div>
</div>

        </>
    );
};

export default UserProfile;
