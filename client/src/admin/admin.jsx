import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users, X, CheckCircle2, FileText, Tag } from 'lucide-react';
import api from '../axios';

const EventAdminPanel = () => {
  const [events, setEvents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    startPeriod: 'AM',
    endTime: '',
    endPeriod: 'AM',
    location: '',
    category: '',
    cloudinaryID: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/getEvents');
      console.log(response.data.events || []);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(()=>{
    fetchEvents();
  }, [])

  // Function to format time to 12-hour format with AM/PM
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Function to convert 12-hour format to 24-hour format for storage
  const convertTo24Hour = (time, period) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  // Function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return { time: '', period: 'AM' };
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return { time: `${hour12.toString().padStart(2, '0')}:${minutes}`, period };
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.length < 3 ? 'Title must be at least 3 characters' : '';
      case 'description':
        return value.length < 10 ? 'Description must be at least 10 characters' : '';
      case 'date':
        return !value ? 'Date is required' : '';
      case 'startTime':
        return !value ? 'Start time is required' : '';
      case 'endTime':
        return !value ? 'End time is required' : '';
      case 'location':
        return value.length < 3 ? 'Location must be at least 3 characters' : '';
      case 'category':
        return value.length < 2 ? 'Category must be at least 2 characters' : '';
      default:
        return '';
    }
  };

  const isFieldValid = (name) => formData[name] && !errors[name];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setFocusedField('');
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      startPeriod: 'AM',
      endTime: '',
      endPeriod: 'AM',
      location: '',
      category: '',
      cloudinaryID: ''
    });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    const startTimeData = convertTo12Hour(event.startTime);
    const endTimeData = convertTo12Hour(event.endTime);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: startTimeData.time,
      startPeriod: startTimeData.period,
      endTime: endTimeData.time,
      endPeriod: endTimeData.period,
      location: event.location,
      category: event.category,
      cloudinaryID: event.cloudinaryID || ''
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async() => {
    // Validate form fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'startPeriod' && key !== 'endPeriod' && key !== 'cloudinaryID') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: convertTo24Hour(formData.startTime, formData.startPeriod),
      endTime: convertTo24Hour(formData.endTime, formData.endPeriod),
      location: formData.location,
      category: formData.category,
      cloudinaryID: formData.cloudinaryID
    };

    try {
      if (editingEvent) {
        // Update existing event
        const response = await api.put(`/events/updateEvent/${editingEvent._id}`, eventData);
        console.log(response.data);
        
        // Update local state with the updated event
        setEvents(events.map(event =>
          event._id === editingEvent._id
            ? { ...event, ...response.data.event }
            : event
        ));
      } else {
        // Create new event
        const response = await api.post('/events/eventInsert', eventData);
        console.log(response.data);
        
        // Add the new event to local state
        setEvents([...events, response.data.event]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await api.delete(`/events/deleteEvent/${id}`);
        console.log(response.data);
        
        // Remove the deleted event from local state
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const viewRSVPs = (event) => {
    setSelectedEvent(event);
    setShowRSVPModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Event Management</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Admin Dashboard</p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
            >
              <Plus size={18} />
              Create Event
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6">
          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
              <Calendar className="mx-auto text-slate-400 mb-4" size={40} />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No events yet</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6">Get started by creating your first event</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
              >
                <Plus size={18} />
                Create Event
              </button>
            </div>
          ) : (
            events.map(event => (
              <div key={event._id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{event.title}</h2>
                      {event.category && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium rounded-full w-fit">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                      <div className="flex items-center gap-2 text-slate-700 text-sm sm:text-base">
                        <Calendar size={16} className="text-gray-700 flex-shrink-0" />
                        <span className="break-words">{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 text-sm sm:text-base">
                        <Clock size={16} className="text-gray-700 flex-shrink-0" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 sm:col-span-2 text-sm sm:text-base">
                        <MapPin size={16} className="text-gray-700 flex-shrink-0" />
                        <span className="break-words">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 sm:px-4 py-2 rounded-lg inline-flex text-sm sm:text-base">
                      <Users size={16} className="text-green-600 flex-shrink-0" />
                      <span className="font-semibold">{event.rsvps?.length || 0} RSVPs</span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => viewRSVPs(event)}
                      className="flex-1 lg:flex-none p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                      title="View RSVPs"
                    >
                      <Users size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 lg:flex-none p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="flex-1 lg:flex-none p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-start sm:items-center rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Fill in the event details below</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === 'title' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('title')}
                    onBlur={handleBlur}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                      errors.title ? 'border-red-500' : focusedField === 'title' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('title') ? 'border-green-500' : ''}`}
                    placeholder="Enter event title"
                  />
                  {isFieldValid('title') && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
                    focusedField === 'description' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('description')}
                    onBlur={handleBlur}
                    rows={3}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all resize-none ${
                      errors.description ? 'border-red-500' : focusedField === 'description' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('description') ? 'border-green-500' : ''}`}
                    placeholder="Enter event description"
                  />
                  {isFieldValid('description') && (
                    <CheckCircle2 className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === 'category' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('category')}
                    onBlur={handleBlur}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                      errors.category ? 'border-red-500' : focusedField === 'category' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('category') ? 'border-green-500' : ''}`}
                    placeholder="e.g., Technology, Business, Education"
                  />
                  {isFieldValid('category') && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === 'date' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('date')}
                    onBlur={handleBlur}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                      errors.date ? 'border-red-500' : focusedField === 'date' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('date') ? 'border-green-500' : ''}`}
                  />
                  {isFieldValid('date') && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Start and End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                        focusedField === 'startTime' ? 'text-gray-700' : 'text-gray-400'
                      }`} />
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('startTime')}
                        onBlur={handleBlur}
                        className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                          errors.startTime ? 'border-red-500' : focusedField === 'startTime' ? 'border-gray-700' : 'border-gray-300'
                        } ${isFieldValid('startTime') ? 'border-green-500' : ''}`}
                      />
                      {isFieldValid('startTime') && (
                        <CheckCircle2 className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    <select
                      name="startPeriod"
                      value={formData.startPeriod}
                      onChange={handleInputChange}
                      className="px-2 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 bg-white"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.startTime && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.startTime}</p>}
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                        focusedField === 'endTime' ? 'text-gray-700' : 'text-gray-400'
                      }`} />
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('endTime')}
                        onBlur={handleBlur}
                        className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                          errors.endTime ? 'border-red-500' : focusedField === 'endTime' ? 'border-gray-700' : 'border-gray-300'
                        } ${isFieldValid('endTime') ? 'border-green-500' : ''}`}
                      />
                      {isFieldValid('endTime') && (
                        <CheckCircle2 className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    <select
                      name="endPeriod"
                      value={formData.endPeriod}
                      onChange={handleInputChange}
                      className="px-2 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 bg-white"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.endTime && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.endTime}</p>}
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === 'location' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('location')}
                    onBlur={handleBlur}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                      errors.location ? 'border-red-500' : focusedField === 'location' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('location') ? 'border-green-500' : ''}`}
                    placeholder="Enter event location"
                  />
                  {isFieldValid('location') && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Cloudinary ID (optional) */}
              <div>
                <label htmlFor="cloudinaryID" className="block text-sm font-medium text-gray-700 mb-2">
                  Cloudinary ID
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === 'cloudinaryID' ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    id="cloudinaryID"
                    name="cloudinaryID"
                    value={formData.cloudinaryID}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('cloudinaryID')}
                    onBlur={handleBlur}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                      errors.cloudinaryID ? 'border-red-500' : focusedField === 'cloudinaryID' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('cloudinaryID') ? 'border-green-500' : ''}`}
                    placeholder="Enter Cloudinary public ID (optional)"
                  />
                  {formData.cloudinaryID && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.cloudinaryID && <p className="mt-1 text-sm text-red-500">{errors.cloudinaryID}</p>}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Summary Modal */}
      {showRSVPModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-start sm:items-center rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">RSVP Responses</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{selectedEvent.title}</p>
              </div>
              <button
                onClick={() => setShowRSVPModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8">
              {selectedEvent.rsvps.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Users className="mx-auto text-slate-400 mb-4" size={40} />
                  <p className="text-sm sm:text-base text-slate-600">No RSVPs yet for this event</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvent.rsvps.map(rsvp => (
                    <div key={rsvp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{rsvp.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{rsvp.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${
                        rsvp.status === 'attending' 
                          ? 'bg-green-100 text-green-700' 
                          : rsvp.status === 'maybe'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border-2 border-green-200">
                    <div className="text-xl sm:text-2xl font-bold text-green-700">
                      {selectedEvent.rsvps.filter(r => r.status === 'attending').length}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 mt-1">Attending</div>
                  </div>
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border-2 border-yellow-200">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                      {selectedEvent.rsvps.filter(r => r.status === 'maybe').length}
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-600 mt-1">Maybe</div>
                  </div>
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border-2 border-red-200">
                    <div className="text-xl sm:text-2xl font-bold text-red-700">
                      {selectedEvent.rsvps.filter(r => r.status === 'not attending').length}
                    </div>
                    <div className="text-xs sm:text-sm text-red-600 mt-1">Not Attending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAdminPanel;