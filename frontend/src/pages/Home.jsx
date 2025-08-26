import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Home = () => {

    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [photographers, setPhotographers] = useState([]);
    const [filteredPhotographers, setFilteredPhotographers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all photographers on mount
    React.useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`${API_BASE_URL}/photographer/search`);
                setPhotographers(res.data.photographers || []);
            } catch (err) {
                setError('Failed to fetch photographers');
            }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (category) params.category = category.trim().toLowerCase();
            if (city) params.city = city.trim().toLowerCase();
            if (date) params.date = date;
            const res = await axios.get(`${API_BASE_URL}/photographer/search`, { params });
            const results = res.data.photographers || [];
            setFilteredPhotographers(results);
            if (results.length === 0) {
                setError('No photographers found for selected filters.');
            } else {
                setError('');
            }
        } catch (err) {
            setError('Failed to fetch photographers');
        }
        setLoading(false);
    };

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
                                <option value="marriage">Marriage</option>
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
                                type="date"
                                placeholder="Select Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
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

            {/* Photographers Results */}
            <div className="w-full max-w-7xl px-6 md:px-0 py-8 flex flex-col items-center mx-auto">
                {loading && <p className="text-lg text-gray-700">Loading...</p>}
                {error && <p className="text-lg text-red-500">{error}</p>}
                {((filteredPhotographers && filteredPhotographers.length > 0) || (!filteredPhotographers && photographers.length > 0)) && (
                    <div className="w-full grid md:grid-cols-3 gap-8 mt-6">
                        {(filteredPhotographers ? filteredPhotographers : photographers).map((p, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
                                                                <img src={p.profilePicture || '/default-profile.png'} alt={p.user?.name} className="w-32 h-32 object-cover rounded-full mb-4" />
                                                                <h3 className="text-xl font-bold mb-1 text-gray-800">{p.user?.name}</h3>
                                                                <div className="text-gray-600 font-semibold mb-1">
                                                                    <span className="block">City: {p.city || 'N/A'}</span>
                                                                    <span className="block">State: {p.state || 'N/A'}</span>
                                                                    <span className="block">Address: {p.user?.address || 'N/A'}</span>
                                                                </div>
                                                                <p className="text-gray-600">Categories: {Array.isArray(p.categories) ? p.categories.join(', ') : p.categories}</p>
                                                                <p className="text-yellow-600 font-bold">Rating: {p.averageRating ? p.averageRating.toFixed(2) : 'N/A'}</p>
                                                                <Link to={`/profile/${p._id}`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">View Profile</Link>
                            </div>
                        ))}
                    </div>
                )}
                {filteredPhotographers && filteredPhotographers.length === 0 && (
                    <p className="text-lg text-gray-700">No photographers found for selected filters.</p>
                )}
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

           <Footer />
        </>
    );
};

export default Home;