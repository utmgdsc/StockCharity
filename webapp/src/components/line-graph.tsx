import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
    { name: 'Ty', value: 80 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 100 },
  { name: 'Jun', value: 300 },
  { name: 'Jul', value: 350 },
  { name: 'Aug', value: 500 },
  { name: 'Sep', value: 400 },
  { name: 'Oct', value: 200 },
  { name: 'Nov', value: 250 },
  { name: 'Dec', value: 480 }
];

export default function LineGraph() {
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
}

