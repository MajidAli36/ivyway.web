// Utility function to check if current page is an authentication page
export const isAuthPage = (pathname = null) => {
  const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  
  return currentPath.includes('/login') || 
         currentPath.includes('/register') || 
         currentPath.includes('/signup') || 
         currentPath.includes('/forgot-password') ||
         currentPath.includes('/reset-password') ||
         currentPath.includes('/2fa');
};

// Utility function to check if current page is a site page (public pages)
export const isSitePage = (pathname = null) => {
  const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  
  // Site pages are public pages that don't require authentication
  return currentPath === '/' ||
         currentPath.includes('/about') ||
         currentPath.includes('/contact') ||
         currentPath.includes('/pricing') ||
         currentPath.includes('/features') ||
         currentPath.includes('/help') ||
         currentPath.includes('/support') ||
         currentPath.includes('/terms') ||
         currentPath.includes('/privacy') ||
         currentPath.includes('/faq') ||
         currentPath.includes('/blog') ||
         currentPath.includes('/news') ||
         currentPath.includes('/careers') ||
         currentPath.includes('/press') ||
         currentPath.includes('/legal') ||
         currentPath.includes('/sitemap') ||
         currentPath.includes('/robots.txt') ||
         currentPath.includes('/favicon') ||
         currentPath.includes('/api/') ||
         currentPath.includes('/_next/') ||
         currentPath.includes('/static/');
};

// Utility function to check if current page is a dashboard page (requires authentication)
export const isDashboardPage = (pathname = null) => {
  const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  
  // Dashboard pages are protected pages that require authentication
  return currentPath.includes('/student') ||
         currentPath.includes('/tutor') ||
         currentPath.includes('/counselor') ||
         currentPath.includes('/teacher') ||
         currentPath.includes('/admin') ||
         currentPath.includes('/dashboard') ||
         currentPath.includes('/profile') ||
         currentPath.includes('/settings') ||
         currentPath.includes('/account') ||
         currentPath.includes('/billing') ||
         currentPath.includes('/notifications') ||
         currentPath.includes('/messages') ||
         currentPath.includes('/bookings') ||
         currentPath.includes('/sessions') ||
         currentPath.includes('/availability') ||
         currentPath.includes('/schedule') ||
         currentPath.includes('/reports') ||
         currentPath.includes('/analytics');
};

// Utility function to safely dispatch session expired event
export const dispatchSessionExpiredEvent = (message = "Your session has expired. Please sign in again.") => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    // Only show session expired modal on dashboard pages (not on site pages or auth pages)
    if (isDashboardPage(currentPath) && !isAuthPage(currentPath)) {
      window.dispatchEvent(new CustomEvent('sessionExpired', { 
        detail: { message }
      }));
    } else {
      console.log(`Session expired event ignored on ${currentPath} (not a dashboard page)`);
    }
  }
};

export default {
  isAuthPage,
  isSitePage,
  isDashboardPage,
  dispatchSessionExpiredEvent
};
