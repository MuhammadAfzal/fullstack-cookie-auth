import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useRef, useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FiBarChart2, FiTrendingUp } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface ChartData {
  monthly?: {
    labels: string[];
    data: number[];
  };
  daily?: {
    labels: string[];
    data: number[];
  };
}

export default function DashboardChart({
  chartData,
}: {
  chartData?: ChartData;
}) {
  const chartRef = useRef<any>(null);
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<"monthly" | "daily">("monthly");

  // Use monthly data by default, fallback to daily if monthly not available
  const currentData = chartData?.monthly ||
    chartData?.daily || { labels: [], data: [] };
  const hasBothTypes = chartData?.monthly && chartData?.daily;

  const data = {
    labels: currentData.labels,
    datasets: [
      {
        label:
          chartType === "monthly" ? "Monthly New Users" : "Daily New Users",
        data: currentData.data,
        backgroundColor:
          chartType === "monthly"
            ? "rgba(59, 130, 246, 0.5)"
            : "rgba(16, 185, 129, 0.5)",
        borderColor:
          chartType === "monthly"
            ? "rgba(59, 130, 246, 1)"
            : "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        tension: 0.4,
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
          text:
            chartType === "monthly"
              ? "Monthly User Growth"
              : "Daily User Activity",
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
    [theme, chartType]
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      {hasBothTypes && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Growth Analytics
          </h3>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setChartType("monthly")}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === "monthly"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <FiBarChart2 className="w-4 h-4" />
              Monthly
            </button>
            <button
              onClick={() => setChartType("daily")}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === "daily"
                  ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <FiTrendingUp className="w-4 h-4" />
              Daily
            </button>
          </div>
        </div>
      )}

      <div className="h-[400px]">
        {chartType === "monthly" ? (
          <Bar ref={chartRef} options={options} data={data} />
        ) : (
          <Line ref={chartRef} options={options} data={data} />
        )}
      </div>
    </div>
  );
}
