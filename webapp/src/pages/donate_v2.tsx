// pages/donate.tsx
import { FC, useState, useEffect } from 'react';
import axios from 'axios';

const DonatePage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [donationData, setdonationData] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/charity/total-donations/', {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text',
          validateStatus: () => true
        });
  
        // Parse response data (handles both JSON and text responses)
        const data = JSON.parse(response.data);
  
        if (data) {
          setdonationData(data);
          setLoading(false);
        } else {
          console.error('Error creating session:', data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Request failed:', error);
        setLoading(false);
      }
    };
    fetchDonations()
  }, []);

  const handleDonate = async (fixed: string, amount: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/donate', {
        fixed,
        amount
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text',
        validateStatus: () => true
      });

      // Parse response data (handles both JSON and text responses)
      const data = JSON.parse(response.data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Error creating session:', data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-8">Donate</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => handleDonate("true", "10")}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $10
        </button>
        <button
          onClick={() => handleDonate("true", "25")}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $25
        </button>
        <button
          onClick={() => handleDonate("true", "50")}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate $50
        </button>
        <button
          onClick={() => handleDonate("false", "0")}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Donate Any Amount
        </button>
      </div>
      {loading && <p className="text-gray-500">Redirecting to payment...</p>}
      <div className="pt-10">
        <h1>Not convinced? Here is our impact so far...</h1>
        <h2 className="text-gray-900">We have donated this much so far</h2>
        <pre>{JSON.stringify(donationData, null, 2)}</pre>
      </div>

    </div>
  );
};

export default DonatePage;