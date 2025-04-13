import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

type DonationData = {
  "monthly_donations": { [month: string]: number }[];
}

export type LineGraphProps = {
  donationData: {
    monthly_donations: { [month: string]: number }[];
  };
};

// Transform your donation format into chart-friendly format
const transformLineChartData = (
  donationData: DonationData
): { name: string; value: number }[] => {
  return donationData["monthly_donations"].map((entry) => {
    const [month, value] = Object.entries(entry)[0];
    return { name: month, value };
  });
};

const LineGraph: React.FC<LineGraphProps> = ({ donationData }) => {
  const data = transformLineChartData(donationData);

  return (
    <div className="flex justify-center items-center h-64">
      <LineChart
        width={600}
        height={300}
        data={data}
        className="text-gray-700"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="name" className="text-sm text-gray-500" />
        <YAxis className="text-sm text-gray-500" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#222"
          strokeWidth={4}
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export default LineGraph;
