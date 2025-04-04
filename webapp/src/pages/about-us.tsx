import { JSX, useEffect, useState } from "react";
import Image from "next/image";
import { getTotalDividends } from "@/util/request";

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
  const [dividendTotal, setDividendTotal] = useState<number>(NaN);

  useEffect(() => {
    // Fetch total dividends
    getTotalDividends().then(response=>setDividendTotal(response.data.total_dividends));
    // Fetch portfolio from backend
    fetch("http://127.0.0.1:8000/api/portfolio/")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Data:", data);
        setPortfolio(data.portfolio || []);
        setTotalInvestment(data.total_investment || 0);
      })
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  return (
    <div className="font-sans">
      <section className="min-h-screen bg-[#B4E0C3] p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/photos/1000+poorpeoplepictures.jpg"
              alt="Sample Image"
              width={800}
              height={500}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Text */}
          <div className="w-full lg:w-1/2 p-6 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-sky-950 tracking-tight mb-6">Who We Are</h1>
            <p className="mb-4 text-lg leading-relaxed">
              At <strong>Stock Charity</strong>, we&apos;re reimagining how charitable giving can create long-term impact. 
              Many local and smaller charities struggle with inconsistent funding&mdash;donations often peak during holidays 
              or in response to high-profile events, then quickly taper off. These unpredictable patterns make it difficult 
              for charities to plan ahead or sustain ongoing projects.
            </p>

            <p className="mb-4 text-lg leading-relaxed">
              We believe there&apos;s a better way.
            </p>

            <p className="mb-4 text-lg leading-relaxed">
              <strong>Stock Charity</strong> is a web-based platform that transforms one-time donations into a lasting 
              source of support. Instead of relying solely on periodic contributions, we invest donated funds into 
              dividend-paying stocks. The dividends generated from these investments are then used to provide consistent, 
              year-round funding to our partner charities.
            </p>

            <p className="mb-4 text-lg leading-relaxed">
              Our mission is to bring financial stability to the nonprofit sector&mdash;especially the smaller, 
              community-focused organizations that often go unnoticed. By turning donations into investments, we help 
              amplify every contribution and ensure that the causes people care about continue to receive support long 
              after the donation is made.
            </p>

            <p className="mb-4 text-lg leading-relaxed">
              Join us in building a more sustainable future for giving.
            </p>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <div className="text-center my-8">
        <h2 className="text-3xl text-sky-950 font-bold">Frequently Asked Questions</h2>
      </div>

      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item border border-gray-300 bg-white shadow-md rounded-lg">
          <input type="radio" name="faq" defaultChecked />
          <div className="collapse-title text-xl font-medium">Which Stocks Do We Invest In?</div>
          <div className="collapse-content">
            <p>The following is a list of our current investments and the total investments in every stock. We try to invest in companies that are actively not ruining the world around us, while still returning high dividends</p>
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
          <div className="collapse-title text-xl font-medium">Why buy dividends and not just donate directly to charities?</div>
          <div className="collapse-content">
            <p>
              Investing donations into dividend-paying stocks creates sustainable, long-term value for charities. 
              While it may take several years for dividends to surpass the cost of the stock, once they do, they continue generating consistent income—year after year. 
              For example, a $39.83 investment in LyondellBasell in 2014 grew to $92.58 by 2024 and paid out $47.67 in dividends. 
              That&apos;s over 119% of the original donation given back to charity in dividends alone, and the stock itself more than doubled in value. 
              As companies grow, dividends typically increase too&mdash;LyondellBasell&apos;s dividend grew from $0.60 to $1.34 over that decade. 
              By holding stocks for the long term, we aim to generate far more for charities than a one-time donation ever could.
            </p>
            <br /><br />
            <p className="font-bold text-center">
              From the inception of StockCharity, we have accumulated {dividendTotal.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })} in total donations for
              all our partnered charities. We hope that the work we're doing here ends up benefitting our partners for years to come.  
            </p>

          </div>
        </div>

        <div className="collapse collapse-arrow join-item border border-gray-300 bg-white shadow-md rounded-lg">
          <input type="radio" name="faq" />
          <div className="collapse-title text-xl font-medium">Why donate through Stock Charity instead of directly to other charities?</div>
          <div className="collapse-content">
            <p>
              Donating through Stock Charity multiplies your impact. Rather than a single-use donation, your contribution is invested to create 
              a steady stream of funding for years to come. Even a modest donation today can result in growing returns that continuously support 
              important causes. For example, a single donation could pay out more than its value over time and continue giving beyond a decade.
              <br /><br />
              Additionally, as a registered charity, Stock Charity can provide official tax receipts, which donors can use to reduce the taxes 
              they owe&mdash;creating another layer of benefit and motivation to give. By combining financial strategy with social impact, 
              Stock Charity ensures that your generosity goes further.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
