import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";
import { useState } from 'react';

const ActivityLog = ({ activities }) => {
  console.log(activities); // Log the activities to the console

  const FormatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  return (
    <AuthenticatedLayout
      header
     
    >
      <Head title="Activity Log" />

      <div className="p-5 mx-4">
        <div className="font-[sans-serif] overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-sm overflow-hidden">
            <thead className="whitespace-nowrap">
              <tr className="text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black">

                <th className="p-4 text-left text-sm font-semibold">User</th>
                <th className="p-4 text-left text-sm font-semibold">Email</th>
                <th className="p-4 text-left text-sm font-semibold">Log Name</th>
                <th className="p-4 text-left text-sm font-semibold">Action</th>
                <th className="p-4 text-left text-sm font-semibold">Event</th>
                <th className="p-4 text-left text-sm font-semibold">Properties</th>
                <th className="p-4 text-left text-sm font-semibold">Time</th>
              </tr>
            </thead>
           <ActivityTable activities={activities} />
          </table>
        </div>

        <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
          <span class="flex items-center col-span-3"> Showing {activities.from} - {activities.to} of {activities.total} </span>
          <span class="col-span-2"></span>

          <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
              <ul class="inline-flex items-center">

                <li>
                  <button onClick={() => activities.links[0].url ? router.get(activities.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                    <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                    </svg>
                  </button>
                </li>
                {(() => {
                  let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                  const activeIndex = activities.links.findIndex((l) => l.active);

                  return activities.links
                    .slice(1, -1) // Exclude the first and last items
                    .filter((link, index, array) => {
                      const currentIndex = parseInt(link.label, 10); // Parse label as number
                      if (isNaN(currentIndex)) return true; // Always include non-numeric items like "..."

                      // Adjust range dynamically based on the active index
                      const rangeStart = Math.max(0, activeIndex - 2); // Start range around active
                      const rangeEnd = Math.min(array.length - 1, activeIndex + 2); // End range around active

                      // Show links within the range or first/last few
                      return (
                        index < 3 || // First 3 pages
                        index > array.length - 4 || // Last 3 pages
                        (index >= rangeStart && index <= rangeEnd) // Pages close to the active page
                      );
                    })
                    .map((link, index, array) => {
                      const currentIndex = parseInt(link.label, 10); // Parse label as a number
                      const isEllipsis =
                        !isNaN(currentIndex) &&
                        lastShownIndex !== -1 &&
                        currentIndex - lastShownIndex > 1; // Check for gaps

                      // Update lastShownIndex only for valid numeric labels
                      if (!isNaN(currentIndex)) {
                        lastShownIndex = currentIndex;
                      }

                      return (
                        <li key={index}>
                          {isEllipsis ? (
                            <span className="px-3 py-1">...</span>
                          ) : link.active ? (
                            // Active page button
                            <button
                              className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-black dark:bg-gray-100 border border-r-0 border-black dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple"
                              aria-current="page"
                            >
                              {link.label}
                            </button>
                          ) : (
                            // Inactive link button
                            <button
                              onClick={() => link.url && window.location.assign(link.url)}
                              className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                            >
                              {link.label}
                            </button>
                          )}
                        </li>
                      );
                    });
                })()}


                <li>
                  <button onClick={() => activities.links[activities.links.length - 1].url && window.location.assign(activities.links[activities.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
                    <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ActivityLog;



const ActivityTable = ({ activities }) => {
  const [visibleProperties, setVisibleProperties] = useState({});

  const toggleProperties = (id) => {
    setVisibleProperties((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <tbody className="whitespace-nowrap">
      {activities?.data?.length > 0 ? (
        activities.data.map((activity) => (
          <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
            <td className="p-4 text-sm text-gray-700">
              {activity.causer ? activity.causer.name : "System"}
            </td>
            <td className="p-4 text-sm text-gray-700">
              {activity.causer ? activity.causer.email : "N/A"}
            </td>
            <td className="p-4 text-sm text-gray-700">{activity.log_name}</td>
            <td className="p-4 text-sm text-gray-700">{activity.description}</td>
            <td className="p-4 text-sm text-gray-700">{activity.event}</td>

            {/* Properties Column with Toggle Button */}
            <td className="p-4 text-sm text-gray-700">
              {activity.properties && (
                <>
                  <button
                    onClick={() => toggleProperties(activity.id)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    {visibleProperties[activity.id] ? "Hide Details" : "Show Details"}
                  </button>

                  {visibleProperties[activity.id] && (
                    <div className="overflow-x-auto mt-2">
                      <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="py-2 px-4 border-b">Property</th>
                            <th className="py-2 px-4 border-b">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(activity.properties).map(([key, value]) => (
                            <tr key={key} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b font-semibold">{key}</td>
                              <td className="py-2 px-4 border-b">
                                {typeof value === "object" ? (
                                  <ul className="list-disc list-inside bg-gray-100 p-2 rounded">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                      <li key={subKey}>
                                        <strong>{subKey}: </strong> {subValue}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  value
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </td>

            <td className="p-4 text-sm text-gray-700">
              {new Date(activity.created_at).toLocaleString()}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="p-4 text-sm text-center text-gray-700">
            No activity logs found.
          </td>
        </tr>
      )}
    </tbody>
  );
};