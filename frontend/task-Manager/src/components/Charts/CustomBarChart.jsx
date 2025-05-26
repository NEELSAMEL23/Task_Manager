import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

// Color logic based on task priority
const getBarColor = (status) => {
    switch (status) {
        case "Low":
            return "#00BC7D"; // Green
        case "Medium":
            return "#FFA500"; // Orange
        case "High":
            return "#FF4C4C"; // Red
        default:
            return "#8884d8"; // Default color
    }
};

// Tooltip content
const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { status, count } = payload[0].payload;
        return (
            <div className="bg-white p-2 border rounded shadow text-sm">
                <p className="font-semibold">{status} Priority</p>
                <p className="text-gray-700">Tasks: {count}</p>
            </div>
        );
    }
    return null;
};

// Main bar chart component
const CustomBarChart = ({ data }) => {
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip content={<CustomToolTip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;
