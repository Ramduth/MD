import { useState, useEffect } from 'react';

export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);

    setIsMobile(mobile);
    setIsIOS(ios);
    setIsAndroid(android);
  }, []);

  const getWhatsAppUrl = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    
    if (isMobile) {
      return `https://wa.me/?text=${encodedMessage}`;
    } else {
      return `https://web.whatsapp.com/send?text=${encodedMessage}`;
    }
  };

  return {
    isMobile,
    isIOS,
    isAndroid,
    getWhatsAppUrl,
  };
};