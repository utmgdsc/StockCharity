// pages/donate.tsx
import { FC, useState } from 'react';
import { useRouter } from 'next/router';

const DonatePage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDonate = async (amount: number) => {
    // setLoading(true);
    // try {
    //   const response = await fetch('http://localhost:8000/donate/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ amount }), // amount is in cents
    //   });
    //   const data = await response.json();
    //   if (data.url) {
    //     // Redirect to the Stripe checkout page
    //     window.location.href = data.url;
    //   } else {
    //     console.error('Error creating session:', data.error);
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   console.error('Request failed:', error);
    //   setLoading(false);
    // }
    try {
      const response = await fetch('http://localhost:8000/donate/');
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-8">Donate</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => handleDonate(1000)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $10
        </button>
        <button
          onClick={() => handleDonate(2500)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $25
        </button>
        <button
          onClick={() => handleDonate(5000)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $50
        </button>
        <button
          onClick={() => handleDonate(2000)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate Any Amount
        </button>
      </div>
      {loading && <p className="text-gray-500">Redirecting to payment...</p>}
    </div>
  );
};

export default DonatePage;
