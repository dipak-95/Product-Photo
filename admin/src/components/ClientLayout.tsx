'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Outline icons for UI

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login';

    useEffect(() => {
        setMounted(true);
        // Helper to check auth
        const checkAuth = () => {
            const admin = localStorage.getItem('admin');
            if (!admin && !isLoginPage) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [pathname, isLoginPage, router]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Avoid hydration mismatch by waiting for mount
    if (!mounted) return null;

    if (isLoginPage) {
        return (
            <main className="min-h-screen bg-black text-white">
                <ToastContainer theme="dark" />
                {children}
            </main>
        );
    }

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden relative">
            <ToastContainer theme="dark" />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
         fixed inset-y-0 left-0 z-50 w-64 bg-[#111113] border-r border-[#27272a] 
         transform transition-transform duration-300 ease-in-out 
         lg:translate-x-0 lg:static lg:block
         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
       `}>
                {/* Mobile Close Button (inside sidebar header area if needed, but Sidebar has header) */}
                {/* We can overlay a close button or rely on clicking outside. Let's add specific close for clarity */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="h-full overflow-y-auto">
                    <Sidebar />
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#111113] border-b border-[#27272a] sticky top-0 z-30">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#27272a] transition-colors"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-lg ml-3 text-white">Admin Panel</span>
                    </div>
                    {/* Add User Profile or other icons here if needed */}
                    <div className="w-8"></div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
