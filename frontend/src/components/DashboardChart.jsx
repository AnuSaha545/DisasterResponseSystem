import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function DashboardChart({ total, critical, medical }) {
  const data = [
    {
      name: "Critical",
      value: critical,
    },
    {
      name: "Medical",
      value: medical,
    },
    {
      name: "Other",
      value: Math.max(total - medical, 0),
    },
  ];

  const COLORS = ["#ff4d4f", "#52c41a", "#1890ff"];

  return (
    <div className="card shadow p-3">
      <h4 className="text-center mb-3">
        Emergency Analytics
      </h4>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default DashboardChart;