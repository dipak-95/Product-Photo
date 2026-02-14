'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    Square3Stack3DIcon,
    RectangleStackIcon,
    PhotoIcon,
    SparklesIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/solid';

const Sidebar = () => {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Categories', href: '/categories', icon: Square3Stack3DIcon },
        { name: 'SubCategories', href: '/subcategories', icon: RectangleStackIcon },
        { name: 'Products', href: '/products', icon: PhotoIcon },
        { name: 'Banners', href: '/banners', icon: PhotoIcon },
        { name: 'Premium', href: '/premium', icon: SparklesIcon },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#111113] text-[#8e8e93]">
            <div className="flex items-center justify-center p-6 border-b border-[#27272a]">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Admin Panel
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block relative group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-[#27272a] rounded-lg"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className={`relative flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'text-white font-medium' : 'hover:bg-[#27272a]/50 hover:text-white'
                                }`}>
                                <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#27272a]">
                <button className="flex items-center w-full px-4 py-3 hover:bg-[#27272a]/50 rounded-lg text-[#ef4444] transition-colors">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
