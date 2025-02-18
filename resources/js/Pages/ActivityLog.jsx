import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";

const ActivityLog = ({ activities }) => {
  console.log(activities); // Log the activities to the console

  const FormatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  return (
    <AuthenticatedLayout
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('setting'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Activity Log</h2>
        </>
      }
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
            <th className="p-4 text-left text-sm font-semibold">Time</th>
          </tr>
        </thead>
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
                <td className="p-4 text-sm text-gray-700">
                  {new Date(activity.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-sm text-center text-gray-700">
                No activity logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ActivityLog;