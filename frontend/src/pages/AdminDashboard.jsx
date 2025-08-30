
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
  const [pendingPhotographers, setPendingPhotographers] = useState([]);
  const [approvedPhotographers, setApprovedPhotographers] = useState([]);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', phone: '', address: '', categories: '' });
  const navigate = useNavigate();

  // Fetch photographers
  const fetchPhotographers = () => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/admin/pending-photographers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPendingPhotographers(res.data.photographers || []))
      .catch(() => setError('Failed to load pending photographers'));
    axios.get(`${API_BASE_URL}/admin/approved-photographers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setApprovedPhotographers(res.data.photographers || []))
      .catch(() => setError('Failed to load approved photographers'));
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  // Approve photographer
  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE_URL}/admin/photographers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhotographers();
    } catch {
      setError('Failed to approve photographer');
    }
  };

  // Reject photographer
  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/admin/photographers/${id}/reject`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhotographers();
    } catch {
      setError('Failed to reject photographer');
    }
  };

  // Delete photographer
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/admin/photographers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhotographers();
    } catch {
      setError('Failed to delete photographer');
    }
  };

  // Add photographer
  const handleAddPhotographer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/admin/photographers`, addForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setAddForm({ name: '', email: '', password: '', phone: '', address: '', categories: '' });
      fetchPhotographers();
    } catch {
      setError('Failed to add photographer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Pending Photographers</h3>
          <div className="bg-white rounded-xl shadow p-6">
            {pendingPhotographers.length === 0 ? (
              <p className="text-gray-500">No pending photographers.</p>
            ) : (
              pendingPhotographers.map(p => (
                <div key={p._id} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{p.user?.name}</div>
                    <div className="text-sm text-gray-600">{p.user?.email}</div>
                    <div className="text-sm text-gray-600">Categories: {Array.isArray(p.categories) ? p.categories.join(', ') : p.categories}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => handleApprove(p._id)}>Approve</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleReject(p._id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Approved Photographers</h3>
          <div className="bg-white rounded-xl shadow p-6">
            <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : 'Add Photographer'}
            </button>
            {showAddForm && (
              <form className="mb-6 space-y-3" onSubmit={handleAddPhotographer}>
                <input type="text" name="name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 border rounded" required />
                <input type="email" name="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 border rounded" required />
                <input type="password" name="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 border rounded" required />
                <input type="text" name="phone" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 border rounded" />
                <input type="text" name="address" value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} placeholder="Address" className="w-full px-3 py-2 border rounded" />
                <input type="text" name="categories" value={addForm.categories} onChange={e => setAddForm({ ...addForm, categories: e.target.value })} placeholder="Categories (comma separated)" className="w-full px-3 py-2 border rounded" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add</button>
              </form>
            )}
            {approvedPhotographers.length === 0 ? (
              <p className="text-gray-500">No approved photographers.</p>
            ) : (
              approvedPhotographers.map(p => (
                <div key={p._id} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{p.user?.name}</div>
                    <div className="text-sm text-gray-600">{p.user?.email}</div>
                    <div className="text-sm text-gray-600">Categories: {Array.isArray(p.categories) ? p.categories.join(', ') : p.categories}</div>
                  </div>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
