import React, { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";

interface TestResult {
  endpoint: string;
  status: "loading" | "success" | "error";
  message: string;
  data?: any;
}

export function ApiGatewayTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      {
        name: "API Gateway Health",
        test: () => apiClient.healthCheck(),
      },
      {
        name: "Auth Service Health",
        test: () => apiClient.getProfile(),
      },
      {
        name: "User Service Search",
        test: () => apiClient.searchUsers("test", 1, 5),
      },
      {
        name: "User Service Health",
        test: () =>
          fetch("http://localhost:3000/api/users/search?q=test").then((res) =>
            res.json()
          ),
      },
    ];

    for (const test of tests) {
      setResults((prev) => [
        ...prev,
        { endpoint: test.name, status: "loading", message: "Testing..." },
      ]);

      try {
        const data = await test.test();
        setResults((prev) =>
          prev.map((r) =>
            r.endpoint === test.name
              ? {
                  endpoint: test.name,
                  status: "success",
                  message: "✅ Success",
                  data,
                }
              : r
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setResults((prev) =>
          prev.map((r) =>
            r.endpoint === test.name
              ? {
                  endpoint: test.name,
                  status: "error",
                  message: `❌ ${message}`,
                }
              : r
          )
        );
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            API Gateway Connection Test
          </h2>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? "Running Tests..." : "Run Tests"}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-md border ${
                result.status === "loading"
                  ? "bg-blue-50 border-blue-200"
                  : result.status === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {result.endpoint}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === "loading"
                      ? "bg-blue-100 text-blue-800"
                      : result.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{result.message}</p>
              {result.data && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    View Response Data
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-900 mb-2">
            Connection Summary
          </h3>
          <div className="text-sm text-gray-600">
            <p>
              <strong>API Gateway URL:</strong> http://localhost:3000/api
            </p>
            <p>
              <strong>Frontend URL:</strong> http://localhost:5173
            </p>
            <p>
              <strong>Auth Service:</strong> http://localhost:5001
            </p>
            <p>
              <strong>User Service:</strong> http://localhost:3002
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
