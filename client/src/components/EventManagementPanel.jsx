import React, { useEffect, useState } from 'react';
import { Menu, X, Search, Calendar, MapPin, User, LogOut, Clock, Filter } from 'lucide-react';
import api from '../axios';
import { getToken, getUser, isAuthenticated, logout } from '../utils/auth';

const EventManagementPanel = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [userData,setUserData] = useState({});

  // Sample events data


  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setUserData( getUser());

    // Get events with token
    const fetchEvents = async () => {
      try {
        const token = getToken();
        const response = await api.get('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          logout();
          window.location.href = '/login';
        }
      }
    };


    fetchEvents();
  }, []);

 

    //   time: '10:00 AM',[]
    //   venue: 'Convention Center, Delhi',
    //   description: 'Annual technology conference featuring industry leaders and innovative startups.',
    //   image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
    //   category: 'Conference',
    //   rsvp: null
    // },
    // {
    //   id: 2,
    //   title: 'Marketing Workshop',
    //   date: '2025-11-20',
    //   time: '2:00 PM',
    //   venue: 'Business Hub, Noida',
    //   description: 'Learn the latest digital marketing strategies and tools for 2025.',
    //   image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=250&fit=crop',
    //   category: 'Workshop',
    //   rsvp: null
    // },
    // {
    //   id: 3,
    //   title: 'Music Festival',
    //   date: '2025-12-05',
    //   time: '6:00 PM',
    //   venue: 'Outdoor Arena, Gurgaon',
    //   description: 'Experience an evening of live music from top artists across genres.',
    //   image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop',
    //   category: 'Concert',
    //   rsvp: null
    // },
    // {
    //   id: 4,
    //   title: 'Startup Networking Event',
    //   date: '2025-11-25',
    //   time: '5:00 PM',
    //   venue: 'Co-working Space, Delhi',
    //   description: 'Connect with entrepreneurs, investors, and innovators in the startup ecosystem.',
    //   image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop',
    //   category: 'Seminar',
    //   rsvp: null
    // }

      const fetchEvents = async () => {
    try {
      const token = getToken();
      const response = await api.get('/events/getEvents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      console.log(data);
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchEvents();
  }, [])

  const token = localStorage.getItem('token')
  console.log("Token from localStorage:", token);

  console.log("User Data:", userData);

  


  const handleRSVP = async(eventId, status) => {
    try {
      console.log("Handling RSVP for event:", eventId, "with status:", status);
      // const token = getToken();
      // Update local state immediately for better UX
      // console.log("Updating RSVP locally:", eventId, status);
      console.log(events);

      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: status } : event
      ));
      // Call API to update RSVP on server
      console.log("Updating RSVP on server:", userData.id );
      const response = await api.put(`/userEvents/${userData.id}/${eventId}`, {status}, {  headers: {  Authorization: `Bearer ${token}` } });
      console.log("RSVP updated on server:", response.data);
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      alert('Failed to update RSVP status. Please try again.');
      // If error is due to unauthorized access, redirect to login
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || event.date === dateFilter;
    const matchesLocation = !locationFilter || event?.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesDate && matchesLocation;
  });

  const myRSVPEvents = events.filter(event => event.rsvp !== null);

  const RSVPButton = ({ status, currentRSVP, onClick, label }) => {
    const isSelected = currentRSVP === status;
    const colors = {
      going: isSelected ? 'bg-green-500 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      maybe: isSelected ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      decline: isSelected ? 'bg-red-500 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    };

    

    return (
      <button
        onClick={onClick}
        className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium text-sm transition-all ${colors[status]} ${isSelected ? 'scale-105 shadow-lg' : ''}`}
      >
        {label}
      </button>
    );
  };

  const EventCard = ({ event, showChangeOption = false }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl`}>
      <div className="relative h-48 overflow-hidden">
        <img src={event.cloudinaryID} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
          {event.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event?.location}</span>
          </div>
        </div>
        
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>
        
        {events.rsvp && (
          <div className="mb-3 text-sm font-medium text-center py-2 rounded-lg bg-blue-50 text-blue-700">
            You selected: <span className="capitalize font-bold">{event.rsvp}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <RSVPButton 
            status="Going" 
            currentRSVP={event.rsvp}
            onClick={() => handleRSVP(event._id, 'Going')}
            label="🟢 Going"
          />
          <RSVPButton 
            status="Maybe" 
            currentRSVP={event.rsvp}
            onClick={() => handleRSVP(event._id, 'Maybe')}
            label="🟡 Maybe"
          />
          <RSVPButton 
            status="Decline" 
            currentRSVP={event.rsvp}
            onClick={() => handleRSVP(event._id, 'Decline')}
            label="🔴 Decline"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header / Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md sticky top-0 z-50 border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Calendar className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Event Planner</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setActiveTab('home')} className={`${activeTab === 'home' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')} hover:text-blue-500 font-medium transition-colors`}>
                Home
              </button>
              <button onClick={() => setActiveTab('my-events')} className={`${activeTab === 'my-events' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')} hover:text-blue-500 font-medium transition-colors`}>
                My RSVP
              </button>
              <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')} hover:text-blue-500 font-medium transition-colors`}>
                Profile
              </button>
            </div>

            {/* User Info & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:bg-opacity-80 transition-colors`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-bold`}>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Welcome, {userData?.name}</span>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className={darkMode ? 'text-white' : 'text-gray-900'} /> : <Menu className={darkMode ? 'text-white' : 'text-gray-900'} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'home' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                Home
              </button>
              <button onClick={() => { setActiveTab('my-events'); setMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'my-events' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                My RSVP
              </button>
              <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                Profile
              </button>
              <div className="flex items-center justify-between px-4 py-2">
                <span className={darkMode ? 'text-white' : 'text-gray-700'}>Welcome, Raj</span>
               
              </div>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <>
            {/* Search & Filter Bar */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Find Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-lg">No events found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'my-events' && (
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My RSVP Events</h2>
            {myRSVPEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map(event => (
                  <EventCard key={event._id} event={event} showChangeOption={true} />
                ))}
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-12 text-center`}>
                <Calendar className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You haven't RSVP'd to any events yet.</p>
                <button onClick={() => setActiveTab('home')} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-8`}>
              <div className="flex flex-col items-center mb-8">
                <div className={`w-24 h-24 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-4xl font-bold mb-4`}>
                  C
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Raj</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                  <input type="text" value="Raj" className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" value="Raj@example.com" className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Member Since</label>
                  <input type="text" value="January 2025" disabled className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-500 border-gray-300'} border rounded-lg`} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Edit Profile
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Event Planner helps you discover and RSVP to amazing events in your area.
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Email: support@eventplanner.com<br />
                Phone: +91 123 456 7890
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Facebook</a>
                <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Twitter</a>
                <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Instagram</a>
              </div>
            </div>
          </div>
          
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            © 2025 Event Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventManagementPanel;