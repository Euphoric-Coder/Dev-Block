import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Play, 
  Code2, 
  BookOpen, 
  Eye, 
  Heart, 
  Download, 
  Calendar,
  Settings,
  Bell,
  User,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Activity,
  Globe,
  Clock,
  Target,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to get stats based on time range
  const getStatsForTimeRange = (range) => {
    const baseStats = {
      '24h': {
        totalBlogs: 3,
        totalTutorials: 1,
        totalSnippets: 8,
        playgroundUsage: 342,
        totalUsers: 1250,
        totalViews: 45230,
        totalLikes: 890,
        totalDownloads: 234
      },
      '7d': {
        totalBlogs: 12,
        totalTutorials: 5,
        totalSnippets: 28,
        playgroundUsage: 2847,
        totalUsers: 8420,
        totalViews: 284739,
        totalLikes: 5821,
        totalDownloads: 1839
      },
      '30d': {
        totalBlogs: 45,
        totalTutorials: 18,
        totalSnippets: 89,
        playgroundUsage: 8934,
        totalUsers: 15420,
        totalViews: 1247392,
        totalLikes: 18394,
        totalDownloads: 6847
      },
      '90d': {
        totalBlogs: 156,
        totalTutorials: 89,
        totalSnippets: 234,
        playgroundUsage: 28473,
        totalUsers: 45230,
        totalViews: 2847392,
        totalLikes: 45821,
        totalDownloads: 18394
      }
    };
    
    return baseStats[range] || baseStats['7d'];
  };

  // Function to get growth percentages based on time range
  const getGrowthData = (range) => {
    const growthData = {
      '24h': {
        blogs: '+5%',
        tutorials: '+2%',
        snippets: '+8%',
        playground: '+15%',
        users: '+12%',
        views: '+18%',
        likes: '+10%',
        downloads: '+14%'
      },
      '7d': {
        blogs: '+12%',
        tutorials: '+8%',
        snippets: '+15%',
        playground: '+23%',
        users: '+18%',
        views: '+25%',
        likes: '+14%',
        downloads: '+19%'
      },
      '30d': {
        blogs: '+28%',
        tutorials: '+22%',
        snippets: '+35%',
        playground: '+45%',
        users: '+32%',
        views: '+48%',
        likes: '+29%',
        downloads: '+38%'
      },
      '90d': {
        blogs: '+67%',
        tutorials: '+54%',
        snippets: '+89%',
        playground: '+112%',
        users: '+78%',
        views: '+95%',
        likes: '+73%',
        downloads: '+84%'
      }
    };
    
    return growthData[range] || growthData['7d'];
  };

  // Initialize stats and growthData based on current timeRange
  const stats = getStatsForTimeRange(timeRange);
  const growthData = getGrowthData(timeRange);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New comment on your blog',
      message: 'Sarah Chen commented on "The Future of Web Development"',
      time: '2 minutes ago',
      read: false,
      type: 'comment'
    },
    {
      id: 2,
      title: 'Tutorial approved',
      message: 'Your "React Hooks Masterclass" tutorial has been approved and published',
      time: '1 hour ago',
      read: false,
      type: 'approval'
    },
    {
      id: 3,
      title: 'Weekly analytics summary',
      message: 'Your content received 15,420 views this week (+23% from last week)',
      time: '2 hours ago',
      read: true,
      type: 'analytics'
    },
    {
      id: 4,
      title: 'New follower',
      message: 'Alex Thompson started following you',
      time: '5 hours ago',
      read: true,
      type: 'follow'
    },
    {
      id: 5,
      title: 'Code snippet liked',
      message: 'Your "React Custom Hook for API Calls" received 50 new likes',
      time: '1 day ago',
      read: true,
      type: 'like'
    }
  ]);

  // Recent Content
  const recentContent = [
    {
      id: 1,
      title: 'The Future of Web Development: Static vs Dynamic Websites',
      type: 'blog',
      status: 'published',
      views: 12500,
      likes: 890,
      publishDate: '2024-04-17',
      author: 'Sagnik Dey'
    },
    {
      id: 2,
      title: 'Complete React Hooks Masterclass',
      type: 'tutorial',
      status: 'published',
      views: 8900,
      likes: 1250,
      publishDate: '2024-04-16',
      author: 'Sarah Chen'
    },
    {
      id: 3,
      title: 'React Custom Hook for API Calls',
      type: 'snippet',
      status: 'published',
      views: 5600,
      likes: 750,
      publishDate: '2024-04-15',
      author: 'Alex Chen'
    },
    {
      id: 4,
      title: 'Advanced TypeScript Patterns',
      type: 'blog',
      status: 'draft',
      views: 0,
      likes: 0,
      publishDate: '2024-04-18',
      author: 'Mike Rodriguez'
    },
    {
      id: 5,
      title: 'Python Data Science Pipeline',
      type: 'snippet',
      status: 'pending',
      views: 0,
      likes: 0,
      publishDate: '2024-04-18',
      author: 'Dr. Emily Watson'
    }
  ];

  // Playground Usage Data
  const playgroundUsage = [
    { language: 'JavaScript', executions: 3847, percentage: 30, color: 'bg-yellow-500' },
    { language: 'Python', executions: 2956, percentage: 23, color: 'bg-green-500' },
    { language: 'TypeScript', executions: 2184, percentage: 17, color: 'bg-blue-500' },
    { language: 'Java', executions: 1538, percentage: 12, color: 'bg-orange-500' },
    { language: 'Go', executions: 1025, percentage: 8, color: 'bg-cyan-500' },
    { language: 'Rust', executions: 769, percentage: 6, color: 'bg-red-500' },
    { language: 'Others', executions: 528, percentage: 4, color: 'bg-gray-500' }
  ];

  // Analytics Data (dummy chart data)
  const analyticsData = {
    views: [
      { date: '2024-04-11', value: 12400 },
      { date: '2024-04-12', value: 13200 },
      { date: '2024-04-13', value: 11800 },
      { date: '2024-04-14', value: 14600 },
      { date: '2024-04-15', value: 15200 },
      { date: '2024-04-16', value: 16800 },
      { date: '2024-04-17', value: 18400 }
    ],
    users: [
      { date: '2024-04-11', value: 890 },
      { date: '2024-04-12', value: 920 },
      { date: '2024-04-13', value: 850 },
      { date: '2024-04-14', value: 1100 },
      { date: '2024-04-15', value: 1250 },
      { date: '2024-04-16', value: 1380 },
      { date: '2024-04-17', value: 1520 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'tutorial':
        return <BookOpen className="h-4 w-4" />;
      case 'snippet':
        return <Code2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const StatCard = ({ title, value, change, icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Dashboard Header */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome back! Here&apos;s what&apos;s happening with your content.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              {/* Settings Button */}
              <button
                onClick={() => setActiveTab("settings")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setNotifications(
                                notifications.map((n) => ({ ...n, read: true }))
                              );
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notifications.filter((n) => !n.read).length} unread
                          notifications
                        </p>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                !notification.read
                                  ? "bg-blue-50/50 dark:bg-blue-900/10"
                                  : ""
                              }`}
                              onClick={() => {
                                setNotifications(
                                  notifications.map((n) =>
                                    n.id === notification.id
                                      ? { ...n, read: true }
                                      : n
                                  )
                                );
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    !notification.read
                                      ? "bg-blue-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium ${
                                      !notification.read
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "content", label: "Content", icon: FileText },
              { id: "analytics", label: "Analytics", icon: Activity },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Blogs"
                  value={stats.totalBlogs}
                  change={growthData.blogs}
                  icon={<FileText className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                  trend="up"
                />
                <StatCard
                  title="Total Tutorials"
                  value={stats.totalTutorials}
                  change={growthData.tutorials}
                  icon={<BookOpen className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                  trend="up"
                />
                <StatCard
                  title="Code Snippets"
                  value={stats.totalSnippets}
                  change={growthData.snippets}
                  icon={<Code2 className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-orange-500 to-orange-600"
                  trend="up"
                />
                <StatCard
                  title="Playground Usage"
                  value={stats.playgroundUsage}
                  change={growthData.playground}
                  icon={<Play className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                  trend="up"
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  change={growthData.users}
                  icon={<Users className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-teal-500 to-teal-600"
                  trend="up"
                />
                <StatCard
                  title="Total Views"
                  value={`${(stats.totalViews / 1000000).toFixed(1)}M`}
                  change={growthData.views}
                  icon={<Eye className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-indigo-500 to-indigo-600"
                  trend="up"
                />
                <StatCard
                  title="Total Likes"
                  value={stats.totalLikes}
                  change={growthData.likes}
                  icon={<Heart className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-pink-500 to-pink-600"
                  trend="up"
                />
                <StatCard
                  title="Downloads"
                  value={stats.totalDownloads}
                  change={growthData.downloads}
                  icon={<Download className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-cyan-500 to-cyan-600"
                  trend="up"
                />
              </div>

              {/* Playground Usage Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Playground Language Usage
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {timeRange === "24h"
                      ? "Last 24 hours"
                      : timeRange === "7d"
                        ? "Last 7 days"
                        : timeRange === "30d"
                          ? "Last 30 days"
                          : "Last 90 days"}
                  </span>
                </div>

                <div className="space-y-4">
                  {playgroundUsage.map((item) => (
                    <div
                      key={item.language}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.language}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`${item.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                        {item.executions.toLocaleString()}
                      </div>
                      <div className="w-12 text-sm text-gray-500 dark:text-gray-500 text-right">
                        {item.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Content
                  </h3>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentContent.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          by {item.author} •{" "}
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(item.publishDate))}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Content Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Content Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage your blogs, tutorials, and code snippets
                  </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </button>
              </div>

              {/* Content Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Types</option>
                  <option value="blog">Blogs</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="snippet">Snippets</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Content Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentContent.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {getTypeIcon(item.type)}
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  by {item.author}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="capitalize text-sm text-gray-900 dark:text-white">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.likes}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.publishDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analytics
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Detailed insights into your content performance
                </p>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {timeRange === "24h"
                      ? "Hourly Views"
                      : timeRange === "7d"
                        ? "Daily Views"
                        : timeRange === "30d"
                          ? "Weekly Views"
                          : "Monthly Views"}
                  </h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {analyticsData.views.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                          style={{ height: `${(item.value / 20000) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(item.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Users Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {timeRange === "24h"
                      ? "Hourly Active Users"
                      : timeRange === "7d"
                        ? "Daily Active Users"
                        : timeRange === "30d"
                          ? "Weekly Active Users"
                          : "Monthly Active Users"}
                  </h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {analyticsData.users.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-green-500 rounded-t-sm transition-all duration-500 hover:bg-green-600"
                          style={{
                            height: `${
                              timeRange === "24h"
                                ? (item.value / 4000) * 100
                                : timeRange === "7d"
                                  ? (item.value / 20000) * 100
                                  : timeRange === "30d"
                                    ? (item.value / 120000) * 100
                                    : (item.value / 350000) * 100
                            }%`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(item.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Content */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Performing Content
                </h3>
                <div className="space-y-4">
                  {recentContent
                    .filter((item) => item.status === "published")
                    .sort((a, b) => b.views - a.views)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.type} • {item.author}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.views.toLocaleString()} views
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.publishDate}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your account and application preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Sagnik Dey"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="sagnik@codeblog.dev"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Full-stack developer passionate about creating educational content and building developer communities."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Email notifications for new comments",
                        checked: true,
                      },
                      { label: "Push notifications for likes", checked: false },
                      { label: "Weekly analytics summary", checked: true },
                      { label: "New follower notifications", checked: true },
                      {
                        label: "Content approval notifications",
                        checked: true,
                      },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={setting.checked}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Security
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Change Password
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                          Enabled
                        </span>
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Active Sessions
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Content Visibility
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="IST">India Standard Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};