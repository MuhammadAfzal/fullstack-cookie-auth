import React from "react";
import { ApiGatewayTest } from "../components/ApiGatewayTest";

export function ApiGatewayTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              API Gateway Integration Test
            </h1>
            <p className="mt-2 text-gray-600">
              Testing the connection between frontend and microservices through
              the API Gateway
            </p>
          </div>

          <ApiGatewayTest />
        </div>
      </div>
    </div>
  );
}
