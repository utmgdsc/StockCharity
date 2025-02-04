import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-700 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left Section - What we do */}
        <Card className="bg-gray-200 flex items-center justify-center">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">What we do</h2>
            <p className="text-gray-700">
              Donations for charities are inconsistent and many charities struggle with finances. 
              To solve this problem, we are creating Stock Charity, a charity that uses donations 
              to buy stocks that payout dividends and then uses those dividends to finance charities year-round.
            </p>
          </CardContent>
        </Card>

        {/* Right Section - Donate Button and Stats */}
        <div className="flex flex-col items-center space-y-8">
          {/* Donate Button */}
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-2xl px-8 py-4"
            route="/charity-signup">
            DONATE
          </Button>

          {/* Stats Card */}
          <Card className="bg-gray-200">
            <CardContent className="text-center">
              <p className="text-lg text-black">We have over</p>
              <p className="text-3xl font-bold text-black">$xxx,xxx.xx</p>
              <p className="text-lg text-black">in stocks</p>
              <p className="text-lg text-black mt-4">which have paid out over</p>
              <p className="text-3xl font-bold text-black">$xxx,xxx.xx</p>
              <p className="text-lg text-black">in dividends to over</p>
              <p className="text-3xl font-bold text-black">xxx charities</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
