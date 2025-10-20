import { usePathname } from 'next/navigation';

export const usePaymentPage = () => {
  const pathname = usePathname();
  
  // Define payment-related paths
  const paymentPaths = [
    '/student/payment',
    '/student/billing',
    '/admin/payments',
    '/admin/payouts',
    '/tutor/earnings',
    '/counselor/payments'
  ];
  
  // Check if current path is payment-related
  const isPaymentPage = paymentPaths.some(path => pathname.startsWith(path));
  
  return {
    isPaymentPage,
    pathname
  };
};






