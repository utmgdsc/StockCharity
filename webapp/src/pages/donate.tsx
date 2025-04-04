import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { fetchDonations, fetchDonationAmount } from '@/util/charity';

interface DonationData {
  amount: number;
}

interface CharityData {
  id: number;
  logo_url: string;
  description: string;
  name: string;
  donations_received: number;
}

const DonatePage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [charities, setCharities] = useState<CharityData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const donationResult = await fetchDonations();
      setDonationData(donationResult);

      const charityList = await fetchDonationAmount();
      setCharities(charityList);
    };

    loadData();
  }, []);

  const handleDonate = async (fixed: string, amount: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/donation',
        { fixed, amount },
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text',
          validateStatus: () => true,
        }
      );

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT: Donation Section */}
      <div className="lg:w-1/2 w-full p-8 flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Donate</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {['10', '25', '50'].map((amt) => (
            <button
              key={amt}
              onClick={() => handleDonate('true', amt)}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Donate ${amt}
            </button>
          ))}
          <button
            onClick={() => handleDonate('false', '0')}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
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
        <h2 className="text-2xl font-bold mb-4 text-center">Supported Charities</h2>
        <div className="space-y-6">
          {charities.length > 0 ? (
            charities.map((charity, index) => {
              const bgColor = index % 2 === 0 ? 'bg-sky-900' : 'bg-emerald-400';
              const textColor = index % 2 === 0 ? 'text-gray-100' : 'text-sky-950';

              return (
                <div
                  key={charity.id}
                  className={`shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow flex items-start gap-4 ${bgColor}`}
                >
                  <img
                    src={charity.logo_url || '/photos/charity.jpg'}
                    alt={charity.name}
                    className="w-20 h-20 object-contain rounded border"
                  />
                  <div>
                    <h2 className={`font-semibold mb-1 ${textColor}`}>{charity.name}</h2>
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
