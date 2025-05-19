/**
 * Utility functions for date formatting in the application
 */

/**
 * Format ISO date string to a readable date
 * @param {string} isoString - ISO date string (e.g. "2025-04-08T00:00:00.000000Z")
 * @param {string} format - Format type: 'short', 'medium', 'long', 'full', 'time'
 * @returns {string} Formatted date string
 */
export const formatDate = (isoString, format = 'medium') => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', isoString);
      return isoString;
    }
    
    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
        
      case 'medium':
        return new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
        
      case 'long':
        return new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
        
      case 'full':
        return new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
        
      case 'time':
        return new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
        
      default:
        return new Intl.DateTimeFormat('id-ID').format(date);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
};

/**
 * Get relative time (e.g. "2 days ago", "just now")
 * @param {string} isoString - ISO date string
 * @returns {string} Relative time
 */
export const getRelativeTime = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return isoString;
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Baru saja';
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    }
    
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    }
    
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari yang lalu`;
    }
    
    return formatDate(isoString, 'short');
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return isoString;
  }
}; 