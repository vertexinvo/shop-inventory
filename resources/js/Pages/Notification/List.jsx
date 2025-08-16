import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaBell, FaEnvelope, FaEnvelopeOpen, FaTrash, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import { MdDelete, MdMarkAsUnread, MdCheckCircle } from 'react-icons/md';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";

export default function List(props) {
  const { auth, notifications, stats } = props

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMarkAllReadModalOpen, setIsMarkAllReadModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSelectAll = (checked) => {
    if (checked) {
      const filteredNotifications = getFilteredNotifications();
      setSelectId(filteredNotifications.map(n => n.id));
    } else {
      setSelectId([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectId([...selectId, id]);
    } else {
      setSelectId(selectId.filter(selectedId => selectedId !== id));
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter === 'read') {
      filtered = filtered.filter(n => n.read_at !== null);
    } else if (filter === 'unread') {
      filtered = filtered.filter(n => n.read_at === null);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type.includes(typeFilter));
    }

    return filtered;
  };

  const getNotificationIcon = (type) => {
    if (type.includes('LowStock')) return <FaExclamationTriangle className="text-orange-500" />;
    if (type.includes('Order')) return <FaBell className="text-blue-500" />;
    return <FaBell className="text-gray-500" />;
  };

  const getNotificationTypeLabel = (type) => {
    if (type.includes('LowStockNotification')) return 'Low Stock Alert';
    if (type.includes('OrderNotification')) return 'Order Update';
    return type.split('\\').pop().replace('Notification', '');
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();
  const allSelected = filteredNotifications.length > 0 && selectId.length === filteredNotifications.length;

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => window.history.back()}
              title="Back"
            />
            <div className="flex items-center space-x-2">
              <FaBell className="text-xl text-gray-600" />
              <h2 className="font-semibold text-xl text-gray-800 leading-tight">Notifications</h2>
              {stats && stats.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      }
    >
      <Head title="Notifications" />

      <div className="flex flex-col px-4 mt-6 mx-auto w-full ">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FaBell className="text-blue-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FaEnvelope className="text-red-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-xl font-semibold">{stats.unread}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FaClock className="text-green-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-xl font-semibold">{stats.today}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-xl font-semibold">{stats.this_week}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="LowStock">Low Stock</option>
                <option value="Order">Orders</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {stats && stats.unread > 0 && (
                <button
                  onClick={() => setIsMarkAllReadModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  <MdCheckCircle size={16} />
                  <span>Mark All Read</span>
                </button>
              )}

              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  <MdDelete size={16} />
                  <span>Delete Selected ({selectId.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredNotifications.length > 0 ? (
            <>
              {/* Select All Header */}
              <div className="p-4 border-b bg-gray-50">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {allSelected ? 'Deselect All' : 'Select All'}
                    {selectId.length > 0 && ` (${selectId.length} selected)`}
                  </span>
                </label>
              </div>

              {/* Notifications */}
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      notification.read_at === null ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectId.includes(notification.id)}
                        onChange={(e) => handleSelectItem(notification.id, e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {getNotificationTypeLabel(notification.type)}
                            </h3>
                            {notification.read_at === null && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                          {notification.data.message || 'No message available'}
                        </p>

                        {/* Additional Data for Low Stock */}
                        {notification.data.product_name && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="font-medium text-gray-700">Product:</span>
                                <span className="ml-1 text-gray-600">{notification.data.product_name}</span>
                              </div>
                              {notification.data.current_quantity !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-700">Current Stock:</span>
                                  <span className="ml-1 text-gray-600">{notification.data.current_quantity}</span>
                                </div>
                              )}
                              {notification.data.reorder_level !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-700">Reorder Level:</span>
                                  <span className="ml-1 text-gray-600">{notification.data.reorder_level}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {notification.read_at === null && (
                          <button
                            onClick={() => {
                              router.post(route('notification.markAsRead', notification.id), {}, {
                                preserveScroll: true,
                                preserveState: true,
                              });
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Mark as read"
                          >
                            <FaEnvelopeOpen size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setIsDeleteModalOpen(notification)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? "You don't have any unread notifications." :
                 filter === 'read' ? "You don't have any read notifications." :
                 "You don't have any notifications yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Single Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen !== null} 
        onClose={() => setIsDeleteModalOpen(null)} 
        title="Delete Notification" 
        message="Are you sure you want to delete this notification? This action cannot be undone."
        onConfirm={() => {
          router.delete(route('notification.destroy', isDeleteModalOpen.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setIsDeleteModalOpen(null)
          });
        }} 
      />

      {/* Bulk Delete Modal */}
      <ConfirmModal 
        isOpen={isBulkDeleteModalOpen} 
        onClose={() => setIsBulkDeleteModalOpen(false)} 
        title="Delete Multiple Notifications"
        message={`Are you sure you want to delete ${selectId.length} notification${selectId.length > 1 ? 's' : ''}? This action cannot be undone.`}
        onConfirm={() => {
          router.post(route('notification.bulkdestroy'), { ids: selectId.join(',') }, {
            onSuccess: () => {
              setIsBulkDeleteModalOpen(false);
              setSelectId([]);
            },
          });
        }} 
      />

      {/* Mark All Read Modal */}
      <ConfirmModal 
        isOpen={isMarkAllReadModalOpen} 
        onClose={() => setIsMarkAllReadModalOpen(false)} 
        title="Mark All as Read"
        message={`Are you sure you want to mark all ${stats?.unread || 0} unread notifications as read?`}
        onConfirm={() => {
          router.post(route('notification.markAllAsRead'), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setIsMarkAllReadModalOpen(false)
          });
        }} 
      />
    </AuthenticatedLayout>
  );
}
