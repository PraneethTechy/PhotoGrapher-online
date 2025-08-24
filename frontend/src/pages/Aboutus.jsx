import React from 'react';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <>
    <section>

      {/* Hero About Us Section */}
      <div className="bg-red-400 text-white py-24 px-6 text-center">
        <h2 className="text-5xl font-bold mb-6">About Us</h2>
        <p className="text-2xl md:text-3xl italic max-w-3xl mx-auto">
          "We connect you with professional photographers and videographers, providing the best experience from browsing profiles to booking and reviews."
        </p>
      </div>

      {/* We Offer Section */}
      <div className="container mx-auto px-6 py-24 text-center bg-gray-800 rounded-2xl my-12 shadow-lg">
        <h3 className="text-4xl font-semibold mb-12 text-red-500">We Offer</h3>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
          {/* Feature 1 */}
          <div className="p-6 bg-gray-900 rounded-xl hover:shadow-lg transition">
            <h4 className="text-2xl font-medium mb-2 text-red-400">Profile Management</h4>
            <p className="text-white">
              Photographers and videographers can create portfolios, showcase their work, and set pricing, making it easier for users to choose based on their style and budget.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-gray-900 rounded-xl hover:shadow-lg transition">
            <h4 className="text-2xl font-medium mb-2 text-red-400">Booking System</h4>
            <p className="text-white">
              Users can browse profiles, send booking requests for specific dates, and manage their appointments efficiently.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-gray-900 rounded-xl hover:shadow-lg transition">
            <h4 className="text-2xl font-medium mb-2 text-red-400">Ratings & Reviews</h4>
            <p className="text-white">
              After sessions, users can rate and review photographers/videographers, helping future clients make informed decisions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-gray-900 rounded-xl hover:shadow-lg transition">
            <h4 className="text-2xl font-medium mb-2 text-red-400">Admin Control</h4>
            <p className="text-white">
              Admins can manage profiles, approve or reject bookings, and ensure smooth operations across the platform.
            </p>
          </div>
        </div>
      </div>

    </section>
    <Footer />
    </>
  );
};

export default AboutUs;
