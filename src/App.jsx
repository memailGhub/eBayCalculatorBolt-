import React, { useState, useEffect } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [inputs, setInputs] = useState({
    salePrice: 150,
    costPrice: 100,
    listingFee: 0.30,
    paypalFeePercentage: 2.9,
    paypalFeeFixed: 0.30,
    ebayFinalValueFeePercentage: 13.5,
    shippingCost: 10,
    additionalFees: 0
  });

  const [calculations, setCalculations] = useState({
    ebayFinalValueFee: 0,
    paypalFee: 0,
    totalFees: 0,
    netProfit: 0,
    netProfitMargin: 0
  });

  const calculateFees = () => {
    const ebayFinalValueFee = inputs.salePrice * (inputs.ebayFinalValueFeePercentage / 100);
    const paypalFee = (inputs.salePrice * (inputs.paypalFeePercentage / 100)) + inputs.paypalFeeFixed;
    const totalFees = inputs.listingFee + ebayFinalValueFee + paypalFee + inputs.additionalFees;
    const netProfit = inputs.salePrice - (totalFees + inputs.shippingCost + inputs.costPrice);
    const netProfitMargin = (netProfit / inputs.salePrice) * 100;

    setCalculations({
      ebayFinalValueFee: (ebayFinalValueFee + inputs.listingFee).toFixed(2),
      paypalFee: paypalFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      netProfit: netProfit.toFixed(2),
      netProfitMargin: netProfitMargin.toFixed(2)
    });
  };

  const chartData = {
    labels: ['Total Fees', 'Net Profit'],
    datasets: [
      {
        data: [
          parseFloat(calculations.totalFees),
          parseFloat(calculations.netProfit)
        ],
        backgroundColor: [
          '#ef4444', // red for total fees
          '#22c55e', // green for net profit
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    calculateFees();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const InputRow = ({ label, field, value }) => (
    <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
      <div className="text-sm text-gray-600">{label}</div>
      <div>
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="any"
          placeholder="Enter value"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <CalculatorIcon className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            eBay Fee Calculator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Calculate your eBay selling fees and potential profit
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Input Parameters</h3>
              
              <InputRow
                label="Item Sale Price (SP)"
                field="salePrice"
                value={inputs.salePrice}
              />
              <InputRow
                label="Item Cost Price (CP)"
                field="costPrice"
                value={inputs.costPrice}
              />
              <InputRow
                label="eBay Listing Fee (LF)"
                field="listingFee"
                value={inputs.listingFee}
              />
              <InputRow
                label="PayPal Fee Percentage (%)"
                field="paypalFeePercentage"
                value={inputs.paypalFeePercentage}
              />
              <InputRow
                label="PayPal Fee Fixed"
                field="paypalFeeFixed"
                value={inputs.paypalFeeFixed}
              />
              <InputRow
                label="eBay Final Value Fee (%)"
                field="ebayFinalValueFeePercentage"
                value={inputs.ebayFinalValueFeePercentage}
              />
              <InputRow
                label="Shipping Cost (SC)"
                field="shippingCost"
                value={inputs.shippingCost}
              />
              <InputRow
                label="Additional Fees (AF)"
                field="additionalFees"
                value={inputs.additionalFees}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Breakdown</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-600">
                    eBay Final Value Fee (13.5%)
                  </div>
                  <div className="text-sm font-bold text-red-300">
                    ${calculations.ebayFinalValueFee}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-600">
                    PayPal Fee (2.9% + $0.3)
                  </div>
                  <div className="text-sm font-bold text-red-300">
                    ${calculations.paypalFee}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="text-base font-semibold text-gray-700">
                    Total Fees
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    ${calculations.totalFees}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="text-base font-semibold text-gray-700">
                    Net Profit
                  </div>
                  <div className={`text-xl font-bold ${parseFloat(calculations.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${calculations.netProfit}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="text-base font-semibold text-gray-700">
                    Net Profit Margin
                  </div>
                  <div className={`text-xl font-bold ${parseFloat(calculations.netProfitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculations.netProfitMargin}%
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Distribution</h3>
                <div className="w-full max-w-md mx-auto">
                  <Pie data={chartData} options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;