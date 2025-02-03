import { JSX } from "react"; 
import PieChart from "@/components/pie-chart";


const Account = (): JSX.Element => {

    // Variables are hard coded for now to demo until backend is implemented.
    const user_name = "USER_NAME";
    const stocks_owned = ["Stock 1", "Stock 2", "Stock 3", "Stock 4", "Stock 5", "Stock 6", "Stock 7"];
    const stocks_owned_values = [300.50, 500.00, 199.50, 100.009, 50.119, 50.00, 150.34];
    const number_of_stocks_owned_per_stock = [3, 1, 1, 4, 1, 1, 3];
    let stock_total_value = 0
    for (let i = 0; i < stocks_owned.length; i++){
        stock_total_value += stocks_owned_values[i] * number_of_stocks_owned_per_stock[i];
    }
    const charities_donated_to = ["Charity 1", "Charity 2", "Charity 3", "Charity 4", "Charity 5", "Charity 6", "Charity 7"];
    const donations_made = [100.00, 50.00, 25.00, 10.00, 5.00, 17.00, 5.00];

    return (
        <>
            <div className="flex flex-row justify-around items-start p-4 text-black">
                <div className="flex flex-col justify-around items-start p-4 text-black">

                    {/* Welcome message */}
                    <div className="py-10 px-20 w-full max-w-lg grid grid-cols-1 gap-6">
                        <div className="">
                            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Hello {user_name},      
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
                                <h3 className="text-lg font-bold">Stocks owned:</h3>
                                <p>Total stock value: ${stock_total_value.toFixed(2)}</p>
                                <br></br>
                                

                                {stocks_owned.map((stock, index) => (
                                    <ul key={index}>{number_of_stocks_owned_per_stock[index]} stocks of {stock} worth ${stocks_owned_values[index].toFixed(2)} each</ul>
                                ))}

                            </div>

                            {/* Dividends earned */}
                            <div className="bg-gray-300 p-2 rounded-md">
                                <h3 className="text-lg font-bold">Dividends earned:</h3>
                                <p>Total dividends earned: $27.62</p>
                                <br></br>
                                <p>$5.43 on Jan. 16th 2025 from {stocks_owned[2]}</p>
                                <p>$6.76 on Oct. 23th 2024 from {stocks_owned[1]}</p>
                                <p>$15.43 on Aug. 6th 2024 from {stocks_owned[0]}</p>

                                
                            </div>

                        </div>
                    </div>
                </div>
                {/* Pie chart of stocks owned */}
                <div className="flex flex-col items-center justify-center py-9 text-black">
                    <p className="text-lg font-bold">Your impact:</p>
                    <PieChart data={donations_made} labels={charities_donated_to} />
                </div>
            </div>
        </>
    );
}

export default Account;