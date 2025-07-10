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
import { useRef, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

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
      backgroundColor: "rgba(59, 130, 246, 0.5)", // Tailwind blue-500/50
    },
  ],
};

export default function DashboardChart() {
  const chartRef = useRef<any>(null);
  const { theme } = useTheme();

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme === "dark" ? "#e5e7eb" : "#374151", // gray-200 / gray-700
          },
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Monthly Visitors",
          color: theme === "dark" ? "#f3f4f6" : "#111827", // gray-100 / gray-900
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#d1d5db" : "#374151", // gray-300 / gray-700
          },
          grid: {
            color: theme === "dark" ? "#374151" : "#e5e7eb", // gray-700 / gray-200
          },
        },
        y: {
          ticks: {
            color: theme === "dark" ? "#d1d5db" : "#374151",
          },
          grid: {
            color: theme === "dark" ? "#374151" : "#e5e7eb",
          },
        },
      },
    }),
    [theme]
  );

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mt-6 h-[300px] md:h-[400px]">
      <Bar ref={chartRef} options={options} data={data} />
    </div>
  );
}
