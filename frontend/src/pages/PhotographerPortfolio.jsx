import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhotographerSidebar from '../components/PhotographerSidebar';

const PhotographerPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5000/photographer/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(res.data.photographer.portfolio || []);
    } catch (err) {
      setError('Failed to load portfolio');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/photographer/portfolio/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Portfolio item uploaded');
      setFile(null);
      fetchPortfolio();
    } catch (err) {
      setError('Failed to upload portfolio item');
    }
  };

  const handleDeletePortfolio = async (url) => {
    try {
      await axios.delete('http://localhost:5000/photographer/portfolio/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { url }
      });
      setSuccess('Portfolio item deleted');
      fetchPortfolio();
    } catch (err) {
      setError('Failed to delete portfolio item');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PhotographerSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">Portfolio</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <div className="bg-white rounded-xl shadow p-6">
          <form className="mb-6" onSubmit={handleUpload}>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="mb-2" />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Upload Portfolio Item</button>
          </form>
          {portfolio.length === 0 ? (
            <p className="text-gray-500">No portfolio items.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {portfolio.map((url, idx) => {
                const isVideo = url.match(/\.(mp4|mov|avi|webm)$/i);
                return (
                  <div key={idx} className="relative">
                    {isVideo ? (
                      <video src={url} controls className="w-full h-80 object-cover rounded" />
                    ) : (
                      <img src={url} alt="Portfolio" className="w-full h-80 object-cover rounded" />
                    )}
                    <button className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeletePortfolio(url)}>Delete</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerPortfolio;
