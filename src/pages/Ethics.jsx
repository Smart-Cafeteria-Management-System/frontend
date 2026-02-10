import React from 'react';

const Ethics = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">⚖️ Ethics, Transparency & Operation Rules</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <p className="text-gray-700 mb-4">
          We are committed to building a fair and responsibly designed system. This page outlines the specific rules governing queue management and data usage.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Section 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-indigo-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Operations & Queue Management ("The Rules")</h2>
          <p className="text-gray-600 mb-4">To ensure fairness, the system adheres to strict algorithmic rules that cannot be overridden by standard staff users:</p>
          
          <ul className="list-disc pl-6 space-y-4 text-gray-700">
            <li>
              <strong className="text-indigo-600">Strict FIFO (First-In-First-Out):</strong>
              <p className="mt-1">Queue positions are assigned based strictly on the timestamp of your booking. There is no "pay-to-skip" or "VIP" priority lane. Every student waits their turn.</p>
            </li>
            <li>
              <strong className="text-indigo-600">Dynamic Wait Time Calculation:</strong>
              <p className="mt-1">We do not use arbitrary wait times. Your estimated wait time is calculated by:</p>
              <ul className="list-circle pl-6 mt-2 space-y-1 text-sm text-gray-600">
                <li>Summing the actual <strong>preparation time</strong> of every single item ordered by students ahead of you.</li>
                <li>Adding a <strong>1-minute buffer</strong> per order for handover/operations.</li>
              </ul>
              <div className="mt-2 text-sm bg-blue-50 p-2 rounded text-blue-800">
                <em>Transparency Note:</em> This means if the person ahead of you ordered 5 distinct meals, your wait time will reflect the reality of cooking them, not just "1 person ahead".
              </div>
            </li>
            <li>
              <strong className="text-indigo-600">Slot Capacity & Fairness:</strong>
              <p className="mt-1">Meal slots have a hard capacity limit. Once <code>booked_count &ge; capacity</code>, the system automatically locks the slot. This prevents overcrowding and ensures the kitchen is not overwhelmed.</p>
            </li>
            <li>
              <strong className="text-indigo-600">No-Show Policy:</strong>
              <p className="mt-1">If you book a meal but do not claim it ("No-Show"), the system records this. Repeated no-shows may lead to penalties or lower priority in future incentive programs.</p>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Data Privacy & User Rights</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-500">✔</span>
              <span><strong>Data Minimization:</strong> We only collect data essential for order processing and demand forecasting (e.g., historical orders, basic profile info).</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-500">✔</span>
              <span><strong>Purpose Limitation:</strong> User data is used <em>solely</em> for improving cafeteria services. It is never sold or shared with third-party advertisers.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-green-500">✔</span>
              <span><strong>Right to be Forgotten:</strong> Users can request the deletion of their account and personal data from our active databases.</span>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Algorithmic Transparency (AI Model)</h2>
          <p className="text-gray-600 mb-4">The Machine Learning component is used strictly to <strong>forecast aggregate demand</strong> (e.g., "How many burgers will we sell on Tuesday?").</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-purple-700 mb-2">Input Features</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Historical Sales Volume</li>
                <li>Weather Conditions</li>
                <li>Academic Calendar (Holidays, Exams)</li>
                <li>Day of the Week</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded flex items-center justify-center">
               <p className="text-center text-gray-700 font-medium">
                 🚫 No Individual Profiling <br/>
                 <span className="text-sm font-normal text-gray-500">The AI does not track or predict individual student eating habits.</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ethics;
