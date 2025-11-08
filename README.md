# EventPlanner - Full Stack Event Management Application

## Overview

EventPlanner is a modern, full-stack web application for managing and organizing events. It features user authentication, event creation, RSVP management, and real-time updates.

![Event Planner Preview](preview.png)

## Features

- 🔐 **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes

- 📅 **Event Management**
  - Create, read, update, and delete events
  - RSVP functionality
  - Event categorization
  - Image upload support using Cloudinary

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Real-time updates
  - Intuitive navigation

- 🔍 **Advanced Search & Filtering**
  - Search by title, description, or category
  - Date-based filtering
  - Location-based filtering
  - RSVP status filtering

## Tech Stack

### Frontend
- React (v19)
- Vite
- TailwindCSS
- Axios
- React Router DOM
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary
- Multer
- Bcrypt

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajvish3133/EventPlanner.git
   cd EventPlanner
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install

   # Create a .env file with the following variables:
   # PORT=4000
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_jwt_secret
   # CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   # CLOUDINARY_API_KEY=your_api_key
   # CLOUDINARY_API_SECRET=your_api_secret

   # Start the server
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   
   # Start the development server
   npm run dev
   ```

### Environment Variables

Create `.env` files in both backend and frontend directories.

**Backend (.env)**
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:4000
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Event Endpoints
- `GET /api/events` - Get all events
- `POST /api/events/eventInsert` - Create a new event
- `PUT /api/events/updateEvent/:id` - Update an event
- `DELETE /api/events/deleteEvent/:id` - Delete an event

### User Event Endpoints
- `PUT /api/userEvents/:userId/:eventId` - Update RSVP status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Project Structure

```
EventPlanner/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── utils/
│       ├── assets/
│       └── App.jsx
└── README.md
```

## Future Enhancements

- [ ] Email notifications
- [ ] Calendar integration
- [ ] Social media sharing
- [ ] Event analytics
- [ ] Mobile app version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React documentation
- MongoDB documentation
- TailwindCSS team
- Cloudinary for image hosting
- The open-source community

