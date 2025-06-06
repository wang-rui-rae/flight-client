import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authApi';
import '../styles/RegisterPage.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // passwor validatecheck
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'UserName cannot be empty.';
    if (!formData.email.trim()) newErrors.email = 'Email cannot be empty.';
    if (!formData.firstName.trim()) newErrors.firstName = 'Firstname cannot be empty.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Lastname cannot be empty.';
    
    if (!formData.password) {
      newErrors.password = 'Password cannot be empty.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'The password must be at least 8 characters long and contain both letters and numbers.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await register(formData);
      // save token
      localStorage.setItem('authToken', response.token);

      navigate('/');
    } catch (error) {
      setApiError(error.message || 'Register failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Please register!</h2>
      
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">username *</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">password *</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          <div className="password-hint">The password must be at least 8 characters long and contain both letters and numbers.</div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="firstName">firstname *</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">lastname *</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register