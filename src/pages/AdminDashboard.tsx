import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiUsers, FiCalendar, FiBell, FiTrendingUp } from 'react-icons/fi';
import Loading from '../components/common/Loading';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const { announcements } = useAnnouncements();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRSVPs, setTotalRSVPs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnapshot.size);

        const rsvpsSnapshot = await getDocs(collection(db, 'rsvps'));
        setTotalRSVPs(rsvpsSnapshot.size);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen message="Loading admin dashboard..." />;
  }

  const upcomingEvents = events.filter((e) => e.status === 'upcoming').length;
  const ongoingEvents = events.filter((e) => e.status === 'ongoing').length;
  const completedEvents = events.filter((e) => e.status === 'completed').length;

  const eventsByCategory = events.reduce((acc: any, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(eventsByCategory).map((category) => ({
    name: category,
    value: eventsByCategory[category],
  }));

  const statusData = [
    { name: 'Upcoming', value: upcomingEvents },
    { name: 'Ongoing', value: ongoingEvents },
    { name: 'Completed', value: completedEvents },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Events</p>
                <p className="text-3xl font-bold mt-1">{events.length}</p>
              </div>
              <FiCalendar className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-1">{totalUsers}</p>
              </div>
              <FiUsers className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total RSVPs</p>
                <p className="text-3xl font-bold mt-1">{totalRSVPs}</p>
              </div>
              <FiTrendingUp className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Announcements</p>
                <p className="text-3xl font-bold mt-1">{announcements.length}</p>
              </div>
              <FiBell className="text-4xl text-orange-200" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Events by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Events by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Events
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {events.slice(0, 10).map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : event.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.createdByName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
