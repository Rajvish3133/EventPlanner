// Auth utility functions

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get user data from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role;
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};
