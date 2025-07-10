import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Visitors",
      data: [120, 190, 300, 500, 200],
      backgroundColor: "rgba(59, 130, 246, 0.5)", // Tailwind blue-500
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Visitors",
    },
  },
};

export default function DashboardChart() {
  return (
    <div className="bg-white p-4 rounded shadow-md mt-6">
      <Bar options={options} data={data} />
    </div>
  );
}
