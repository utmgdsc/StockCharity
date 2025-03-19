// pages/donate.tsx
import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import {fetchDonations, fetchInfo} from '@/util/charity';
import ImageWithDescription from '@/components/charity-card';

interface DonationData {
  amount: number;
}

interface CharityData {
  logo_path: string;
  description: string;
}

const DonatePage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [charityData, setCharityData] = useState<CharityData | null>(null);

  useEffect(() => {

    const loadData = async () => {
      let data = await fetchDonations();
      setDonationData(data);
      data = await fetchInfo(1);
      setCharityData(data);
    };

    // Uncomment this if we have data in the db to showcase
    loadData()
  }, []);

  const handleDonate = async (fixed: string, amount: string) => {
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/api/donation', {
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
      <div className="pt-10 text-center">
        <h1>Not convinced? Here is our impact: </h1>
        {donationData ? (
          <>
          <h2 className="text-gray-500 pt-3">We have donated ${donationData.amount} to these charities!</h2> 
          </>
        ) : (
        <h3>Loading donations...</h3>
      )}
      </div>
      {charityData ? (
        <>
          <ImageWithDescription 
            // replace with charityData.logo_path
            imageSrc={"static/charity.jpg"}
            // replace with charityData.description
            description={"Here at charity A, we are committed to give all children an equal opportunity to learn anything they would like. \
              No matter what kind of needs they require, we try our best to accomodate and make sure they are in the best place to learn. \
              More talking here because it makes this component look better if its not that empty."}
          />
        </>
      ) : (
        <h3>Loading donations...</h3>
      )}

      {charityData ? (
        <>
          <ImageWithDescription 
            // replace with charityData.logo_path
            imageSrc={"static/charity.jpg"}
            // replace with charityData.description
            description={"Here at charity A, we are committed to give all children an equal opportunity to learn anything they would like. \
              No matter what kind of needs they require, we try our best to accomodate and make sure they are in the best place to learn. \
              More talking here because it makes this component look better if its not that empty."}
          />
        </>
      ) : (
        <h3>Loading donations...</h3>
      )}

    </div>
  );
};

export default DonatePage;
