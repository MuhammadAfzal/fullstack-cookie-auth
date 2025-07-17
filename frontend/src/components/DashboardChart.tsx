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

// Accept chartData as a prop
export default function DashboardChart({ chartData }: { chartData?: any }) {
  const chartRef = useRef<any>(null);
  const { theme } = useTheme();

  // Fallback to empty chart if no data
  const data = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: "New Users",
            data: chartData.data,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
          },
        ],
      }
    : {
        labels: [],
        datasets: [
          {
            label: "New Users",
            data: [],
            backgroundColor: "rgba(59, 130, 246, 0.5)",
          },
        ],
      };

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme === "dark" ? "#e5e7eb" : "#374151",
          },
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Monthly New Users",
          color: theme === "dark" ? "#f3f4f6" : "#111827",
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#d1d5db" : "#374151",
          },
          grid: {
            color: theme === "dark" ? "#374151" : "#e5e7eb",
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
