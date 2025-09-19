'use client';

import { useState, useEffect } from 'react';

interface PushNotificationButtonProps {
  className?: string;
  buttonText?: string;
  successText?: string;
  errorText?: string;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  onError?: (error: string) => void;
}
 
export default function PushNotificationButton({
  className = '',
  buttonText = 'Enable Notifications',
  successText = 'Notifications Enabled!',
  errorText = 'Failed to enable notifications',
  onPermissionGranted,
  onPermissionDenied,
  onError
}: PushNotificationButtonProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    // Check if notifications are supported
    if (!('Notification' in window)) {
      setMessage('Notifications not supported in this browser');
      return;
    }

    // Get current permission status
    setPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      const errorMsg = 'Notifications are not supported in this browser';
      setMessage(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setMessage(successText);
        onPermissionGranted?.();
        
        // Show a test notification
        new Notification('Notifications Enabled!', {
          body: 'You will now receive push notifications from this app.',
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });
      } else if (result === 'denied') {
        setMessage('Notifications blocked. Please enable them in your browser settings.');
        onPermissionDenied?.();
      } else {
        setMessage('Notification permission dismissed.');
        onPermissionDenied?.();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorText;
      setMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from your PWA!',
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg ${className}`}>
        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
        </svg>
        Loading...
      </div>
    );
  }

  // Don't render if notifications are not supported
  if (!('Notification' in window)) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg ${className}`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Notifications not supported
      </div>
    );
  }

  // Show success state
  if (permission === 'granted') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {successText}
        </div>
        <button
          onClick={sendTestNotification}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Send Test Notification
        </button>
      </div>
    );
  }

  // Show blocked state
  if (permission === 'denied') {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg ${className}`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
        Notifications blocked
      </div>
    );
  }

  // Show request button (default state)
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <button
        onClick={requestNotificationPermission}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
          isLoading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Requesting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {buttonText}
          </>
        )}
      </button>
      
      {message && (
        <p className={`text-sm text-center max-w-xs ${
          message.includes('Enabled') ? 'text-green-600' : 
          message.includes('blocked') || message.includes('Failed') ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
