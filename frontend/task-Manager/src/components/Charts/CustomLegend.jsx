const CustomLegend = ({ payload }) => {
    return (
        <ul className="flex flex-wrap gap-4 mt-2">
            {payload.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center gap-2 text-sm">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    ></span>
                    {entry.value}
                </li>
            ))}
        </ul>
    );
};

export default CustomLegend;
