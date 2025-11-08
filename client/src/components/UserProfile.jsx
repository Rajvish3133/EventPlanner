// import React, { useState, useEffect } from 'react';
// import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../axios';
// import { getUser, logout, isAuthenticated } from '../utils/auth';

// const UserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Method 1: Get user data from localStorage (already available from login)
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate('/login');
//       return;
//     }

//     // Get user data from localStorage
//     const user = getUser();
//     if (user) {
//       setUserData(user);
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Method 2: Fetch fresh user data from backend using token
//   const fetchUserProfile = async () => {
//     try {
//       setLoading(true);
//       // Token is automatically added by axios interceptor
//       const response = await api.get('/auth/profile');
//       setUserData(response.data);
//       // Update localStorage with fresh data
//       localStorage.setItem('user', JSON.stringify(response.data));
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       setError(err.response?.data?.msg || 'Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await api.post('/auth/logout');
//       logout(); // Clear localStorage
//       navigate('/login');
//     } catch (err) {
//       console.error('Logout error:', err);
//       logout(); // Clear localStorage anyway
//       navigate('/login');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
//         <div className="bg-white p-8 rounded-xl shadow-lg">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={fetchUserProfile}
//             className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 sm:p-8 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
//               <p className="text-gray-600 mt-1">Manage your account information</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 sm:p-8">
//           <div className="flex flex-col items-center mb-8">
//             <div className="bg-gray-100 p-6 rounded-full mb-4">
//               <User size={64} className="text-gray-700" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>
//             <span className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${
//               userData?.role === 'admin' 
//                 ? 'bg-purple-100 text-purple-700' 
//                 : 'bg-blue-100 text-blue-700'
//             }`}>
//               {userData?.role?.toUpperCase()}
//             </span>
//           </div>

//           {/* User Details */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <Mail className="text-gray-600" size={24} />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-600">Email</p>
//                 <p className="font-semibold text-gray-800">{userData?.email}</p>
//               </div>
//             </div>

//             {userData?.Phonenumber && (
//               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <Phone className="text-gray-600" size={24} />
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-600">Phone Number</p>
//                   <p className="font-semibold text-gray-800">{userData.Phonenumber}</p>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <Shield className="text-gray-600" size={24} />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-600">Account Role</p>
//                 <p className="font-semibold text-gray-800">{userData?.role}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <User className="text-gray-600" size={24} />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-600">User ID</p>
//                 <p className="font-semibold text-gray-800 text-sm break-all">{userData?.id}</p>
//               </div>
//             </div>
//           </div>

//           {/* Refresh Button */}
//           <div className="mt-6 flex justify-center">
//             <button
//               onClick={fetchUserProfile}
//               className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg font-semibold"
//             >
//               Refresh Profile Data
//             </button>
//           </div>
//         </div>

//         {/* Token Info (for development) */}
//         <div className="mt-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-3">Developer Info</h3>
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <p className="text-sm text-gray-600 mb-2">Token Status:</p>
//             <p className="text-xs font-mono text-gray-800 break-all">
//               {localStorage.getItem('token') ? '✓ Token Present' : '✗ No Token'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
