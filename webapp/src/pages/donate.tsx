"use client";
import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { fetchDonations, fetchDonationAmount } from '@/util/charity';
import { isLoggedIn } from "@/util/request"; // for auth checking
import { useRouter } from "next/navigation";
import Cookie from 'js-cookie';

interface DonationData {
  amount: number;
}

interface StripeSessionResponse {
  url: string;
  error?: string;
}

interface CharityData {
  id: number;
  logo_url: string;
  description: string;
  charity_name: string;
  donations_received: number;
}

const DonatePage: FC = () => {
  const router = useRouter(); 
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [charities, setCharities] = useState<CharityData[]>([]);
  
  
  useEffect(() => {
    isLoggedIn()
    .then(() => setAuthChecked(true))
    .catch(() => router.push("/login"));
  }, []);
  
  useEffect(() => {
    if (!authChecked) return;
    const loadData = async () => {
      const donationResult = await fetchDonations();
      setDonationData(donationResult);
      
      const charityList = await fetchDonationAmount();
      setCharities(charityList);
    };
    
    loadData();
  }, [authChecked]);
  
  const handleDonate = async (fixed: string, amount: string) => {
    const token = Cookie.get('token');
    if (!token) {
      router.push("/login"); // or show a toast or alert
      return;
    }

    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/api/donation', {
        fixed,
        amount
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        responseType: 'text',
        validateStatus: () => true
      });

      const data: StripeSessionResponse = JSON.parse(response.data);

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

  // Block rendering until auth is confirmed
  if (!authChecked) return null;
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT: Donation Section */}
      <div className="lg:w-1/2 w-full p-8 flex flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-6">Donate</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {['10', '25', '50'].map((amt) => (
            <button
              key={amt}
              onClick={() => handleDonate('true', amt)}
              disabled={loading}
              className="btn-primary py-2 px-4"
            >
              Donate ${amt}
            </button>
          ))}
          <button
            onClick={() => handleDonate('false', '0')}
            disabled={loading}
            className="btn-primary py-2 px-4"
          >
            Donate Any Amount
          </button>
        </div>
        {loading && <p className="text-gray-500 mb-4">Redirecting to payment...</p>}

        <h2 className="text-xl font-semibold text-center mt-6">Here&apos;s our impact:</h2>
        {donationData ? (
          <p className="text-gray-700 text-center mt-2">
            We&apos;ve donated <span className="font-bold">${donationData.amount.toFixed(2)}</span> to charities!
          </p>
        ) : (
          <p className="text-gray-500 mt-2">Loading donation stats...</p>
        )}
      </div>

      {/* RIGHT: Charity Carousel */}
      <div className="lg:w-1/2 w-full p-6 bg-white overflow-y-auto max-h-screen">
        <h2 className="mb-4 text-center text-sky-950">Supported Charities</h2>
        <div className="space-y-6">
          {charities.length > 0 ? (
            charities.map((charity, index) => {
              const bgColor = index % 2 === 0 ? 'bg-sky-900' : 'bg-[#8AC79F]';
              const textColor = index % 2 === 0 ? 'text-gray-100' : 'text-sky-950';

              return (
                <div
                  key={charity.id}
                  className={`shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow flex items-start gap-4 ${bgColor}`}
                >
                  <img
                    src={charity.logo_url || '/photos/charity.jpg'}
                    alt={charity.charity_name}
                    className="w-20 h-20 object-contain rounded border"
                  />
                  <div>
                    <h2 className={`font-semibold mb-1 ${textColor}`}>{charity.charity_name}</h2>
                    <h3 className={`text-sm mb-2 ${textColor}`}>{charity.description}</h3>
                    <p className={`font-bold ${textColor}`}>
                      ${charity.donations_received.toFixed(2)} raised
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Loading charities...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
