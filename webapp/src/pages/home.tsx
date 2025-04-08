import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchDonations} from '@/util/charity';
import {getTotalCharities, getTotalDonations} from '@/util/request';

interface DonationData {
  amount: number;
}

export default function HomePage() {
  const router = useRouter();
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  useEffect(() => {

    const loadData = async () => {
      const data = await fetchDonations();
      setDonationData(data);
    };

    // Uncomment this if we have data in the db to showcase
    loadData()
  }, []);

  const [charityData, setCharityData] = useState<DonationData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const charitiesResponse = await getTotalCharities();
      const charities = charitiesResponse.data.totalCharities; // Ensure correct property access
      setCharityData({ amount: charities });
    };
    fetchData();
  }, []);

  const [donationStockData, setDonationStockData] = useState<DonationData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const donationsResponse = await getTotalDonations();
      const donations = donationsResponse?.data?.donation_total || -1; // Safely access donation_total and alert that something is wrong by using -1
      setDonationStockData({ amount: donations });
    };
    fetchData();
  }, []);

  return (
    <>
      {/*Background Section with Donation call to action */}
      <section 
        className="relative w-full bg-stock-charity min-h-screen flex items-center justify-center bg-cover bg-center"
      >
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl max-w-md w-full text-center lg:w-1/3">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900">Give to Charities Today!</h1>

          {/* Subtitle */}
          <h2 className="mt-4 text-lg text-gray-700">
            Help charities secure long-term, sustainable funding for their initiatives.
          </h2>

          {/* Donate Button */}
          <div className="mt-6">
            <button className="w-full btn-login px-6 py-3" onClick={() => router.push('/donate')} >
              Donate today!
            </button>
          </div>
        </div>
      </section>

      {/*Stats Card*/}
      <div className="bg-blue-200 py-16 w-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 text-center">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-600">In total donations given</dt>
              {donationData ? (
                  <>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    
                    ${donationStockData ? donationStockData.amount.toFixed(2) : "0.00"}
                  </dd>
                  </>
                ) : (
                <h3>Loading donations...</h3>
              )}
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-600">paid out in dividends</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                ${donationData ? donationData.amount.toFixed(2) : "0.00"}
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-600">Charities working with us</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {charityData ? charityData.amount : 0}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};
