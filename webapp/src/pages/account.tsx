import { JSX, useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { AccountType, getAccountInfo, isLoggedIn, getMonthlyDonations } from "@/util/request";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { LineGraphProps } from "@/components/line-graph";

const LineGraph = dynamic(() => import('@/components/line-graph'), { ssr: false });

const Account = (): JSX.Element => {
    const router = useRouter();
    const [accountInfo, setAccountInfo] = useState<AccountType>();
    const [donationInfo, setDonationInfo] = useState<LineGraphProps>();
    const [cookie] = useCookies(["token"])
    useEffect(() => {
        isLoggedIn().then(() =>
            getAccountInfo().then((response) => setAccountInfo(response.data)).catch(() => router.push("login"))
        ).catch(
            () => router.push("login")
        );
    }, [cookie]);

    useEffect(() => {
        isLoggedIn().then(() =>
            getMonthlyDonations().then((response) => setDonationInfo(response.data)).catch(() => router.push("login"))
        ).catch(
            () => router.push("login")
        );
    }, [cookie]);

    return (
        <>
            <div className="flex flex-row justify-around items-start p-4 text-black">
                <div className="flex flex-col justify-around items-start p-4 text-black">

                    {/* Welcome message */}
                    <div className="py-10 px-20 w-full max-w-lg grid grid-cols-1 gap-6">
                        <div className="">
                            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Hello {accountInfo?.first_name} {accountInfo?.last_name},
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Thanks for supporting those in need through Stock Charity!
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-around items-start p-4 text-black">
                        {/* Stocks information */}
                        <div className="flex flex-row gap-10 justify-around items-start">

                            {/* Stocks owned */}
                            <div className="bg-gray-300 p-2 rounded-md">
                                <h3 className="text-lg font-bold">Donations:</h3>
                                <p>Total Donations: {accountInfo?.total_donations?.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })}</p>
                                <br></br>
                                {accountInfo?.donations.map((donation, index) => (
                                    <p key={index}>
                                        {donation.amount.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })} on {new Date(donation.date).toLocaleDateString('en-US')}
                                    </p>
                                ))}



                            </div>

                            {/* Dividends earned */}
                            <div className="bg-gray-300 p-2 rounded-md">
                                <h3 className="text-lg font-bold">Dividends earned:</h3>
                                <p>Total dividends earned: {accountInfo?.total_dividends.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })}</p>
                                {/* <br></br>
                                <p>$5.43 on Jan. 16th 2025 from {stocks_owned[2]}</p>
                                <p>$6.76 on Oct. 23th 2024 from {stocks_owned[1]}</p>
                                <p>$15.43 on Aug. 6th 2024 from {stocks_owned[0]}</p> */}


                            </div>

                        </div>
                    </div>
                </div>
                {/* Pie chart of stocks owned */}
                <div className="flex flex-col items-center justify-center py-9 text-black">
                    <p className="text-lg font-bold pb-3">Your impact:</p>
                    {donationInfo && <LineGraph donationData={donationInfo.donationData} />}
                </div>
            </div>
        </>
    );
}

export default Account;
