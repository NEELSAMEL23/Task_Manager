const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: data } = payload[0];
    return (
      <div className="bg-white shadow-md rounded p-2 text-sm">
        <p className="font-semibold">{data.status}</p>
        <p>Count: {value}</p>
      </div>
    );
  }

  return null;
};

export default CustomToolTip;
