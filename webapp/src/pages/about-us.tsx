import { JSX, useEffect, useState } from "react"; 
import Image from "next/image";

interface Stock {
  stock_name: string;
  symbol: string;
  quantity: number;
  current_price: number;
  stock_value: number;
}

const AboutUs = (): JSX.Element => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  useEffect(() => {
    // Fetch portfolio from backend
    fetch("http://127.0.0.1:8000/api/portfolio/")
      .then((response) => response.json())
      .then((data) => {
        setPortfolio(data.portfolio || []);
        setTotalInvestment(data.total_investment || 0);
      })
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  return (
    <div className="font-sans">

      {/* Title Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-8">
        {/* Left Column - Image */}
        <div className="w-full h-full lg:w-1/2 flex justify-center">
          <Image 
            src="/photos/1000+poorpeoplepictures.jpg" 
            alt="Sample Image" 
            width={800}
            height={500}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 p-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900">Who We Are</h1>
          <p className="mt-4 text-lg text-gray-700">
            Explore the world of sustainable giving and make a lasting impact.  
            We&apos;re the whatever doing something for different charities to get whatever. Our mission is simple: whatever. 
          </p>
        </div>
      </section>
      
      {/* FAQ Section */}
      <div className="text-center my-8">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
      </div>

      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item border border-gray-300 bg-white shadow-md rounded-lg">
          <input type="radio" name="faq" defaultChecked />
          <div className="collapse-title text-xl font-medium">Which Stocks Do We Invest In?</div>
          <div className="collapse-content">
            <p>The following is a list of our current investments and the total investments in every stock.</p>
            {portfolio.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>
                    <th className="p-2 border border-gray-300">Stock</th>
                    <th className="p-2 border border-gray-300">Symbol</th>
                    <th className="p-2 border border-gray-300">Shares</th>
                    <th className="p-2 border border-gray-300">Current Price</th>
                    <th className="p-2 border border-gray-300">Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => (
                    <tr key={stock.symbol} className="text-center">
                      <td className="p-2 border border-gray-300">{stock.stock_name}</td>
                      <td className="p-2 border border-gray-300">{stock.symbol}</td>
                      <td className="p-2 border border-gray-300">{stock.quantity}</td>
                      <td className="p-2 border border-gray-300">${stock.current_price.toFixed(2)}</td>
                      <td className="p-2 border border-gray-300 font-semibold">${stock.stock_value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading stock data...</p>
            )}
            <p className="mt-4 font-bold text-lg">Total Investment: ${totalInvestment.toFixed(2)}</p>
          </div>
        </div>

        <div className="collapse collapse-arrow join-item border border-gray-300 bg-white shadow-md rounded-lg">
          <input type="radio" name="faq" />
          <div className="collapse-title text-xl font-medium">How does our application work?</div>
          <div className="collapse-content">
            <p>We use advanced analytics and real-time data to optimize our investment strategy...</p>
          </div>
        </div>

        <div className="collapse collapse-arrow join-item border border-gray-300 bg-white shadow-md rounded-lg">
          <input type="radio" name="faq" />
          <div className="collapse-title text-xl font-medium">Do we have any other FAQs?</div>
          <div className="collapse-content">
            <p>We will be updating this section with more information soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
