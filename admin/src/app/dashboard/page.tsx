'use client';

import { useEffect, useState } from 'react';
import dashboardService from '../../services/dashboardService';
import {
    Square3Stack3DIcon,
    PhotoIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalProducts: 0,
        premiumCount: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                if (data) {
                    setStats({
                        totalCategories: data.totalCategories || 0,
                        totalProducts: data.totalProducts || 0,
                        premiumCount: data.premiumCount || 0,
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: 'Total Categories', value: stats.totalCategories, icon: Square3Stack3DIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Total Products', value: stats.totalProducts, icon: PhotoIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Premium Content', value: stats.premiumCount, icon: SparklesIcon, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1"> Overview of your app content </p>
                </div>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded-full border border-green-500/20 animate-pulse">
                        System Operational
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((item) => (
                    <div
                        key={item.name}
                        className="group relative overflow-hidden rounded-2xl bg-[#111113] border border-[#27272a] p-6 shadow-sm hover:border-gray-600 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>

                        <div className="relative flex items-center">
                            <div className={`flex-shrink-0 rounded-xl p-3 ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-400 truncate">
                                        {item.name}
                                    </dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-white mt-1">
                                            {item.value}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#111113] border border-[#27272a] rounded-2xl p-6">
                <h2 className="text-lg font-medium text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium">
                        + Add New Product
                    </button>
                    <button className="px-5 py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl transition-all border border-gray-700 font-medium">
                        Manage Categories
                    </button>
                </div>
            </div>
        </div>
    );
}
