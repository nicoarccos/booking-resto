// components/CheckAppointments.tsx

"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CheckAppointments() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/appointments/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        toast.success('Your appointments have been sent to your email.');
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to check appointments.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <motion.label 
            htmlFor="email" 
            className="block text-sm font-body text-text-primary mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Email Address
          </motion.label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative"
          >
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body pr-12"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: email ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {email && (
                <svg 
                  className="w-5 h-5 text-accent" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !email}
          className={`w-full p-4 rounded-default font-sans transition-all ${
            isLoading || !email
              ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-soft hover:shadow-medium'
          }`}
          whileHover={{ scale: isLoading || !email ? 1 : 1.02 }}
          whileTap={{ scale: isLoading || !email ? 1 : 0.98 }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking...
            </span>
          ) : (
            'Check My Appointments'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}



/*
export default function CheckConnection() {
  const makeApiCall = async () => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hello: "world" }),
      });

      const data = await response.json();
      console.log('Response from API:', data);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  return <button onClick={makeApiCall}>Make API Call</button>;
}*/


