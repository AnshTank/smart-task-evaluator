'use client'

import EnhancedNavbar from '@/components/EnhancedNavbar'
import { Bell, CheckCircle, AlertCircle } from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Code evaluation completed',
      message: 'Your "Prime Numbers" task has been evaluated with a score of 85/100',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New feature available',
      message: 'Try our new security vulnerability scanner in Premium reports',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Evaluation limit reached',
      message: 'You have used 3/3 free evaluations this month. Upgrade to Premium for unlimited access.',
      time: '2 hours ago',
      read: true
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default: return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Stay updated with your code evaluations and account activity</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}