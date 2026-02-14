'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import bannerService from '../../services/bannerService';
import authService from '../../services/authService';
import { uploadImage } from '../../services/imageService';
import { useRouter } from 'next/navigation';
import { TrashIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface Banner {
    _id: string;
    imageUrl: string;
    isActive: boolean;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const data = await bannerService.getBanners();
            setBanners(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = authService.getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            let finalImageUrl = imageUrl;

            if (imageFile) {
                setUploading(true);
                const url = await uploadImage(imageFile, 'banners');
                if (url) {
                    finalImageUrl = url;
                }
                setUploading(false);
            }

            if (!finalImageUrl) {
                toast.error('Please provide an image URL or upload a file');
                setSubmitting(false);
                return;
            }

            await bannerService.createBanner({ imageUrl: finalImageUrl }, token);
            toast.success('Banner added successfully');
            setImageUrl('');
            setImageFile(null);
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create banner');
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const token = authService.getToken();
            await bannerService.deleteBanner(id, token!);
            toast.success('Banner deleted');
            fetchBanners();
        } catch (error) {
            toast.error('Failed to delete banner');
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Loading banners...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Manage Banners (Carousel)</h1>

            {/* Add Banner Form */}
            <div className="bg-[#18181b] p-6 rounded-xl border border-[#27272a] mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Add New Banner</h2>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Image URL (Optional if uploading)
                            </label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                    }
                                }}
                                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 self-start"
                    >
                        {submitting || uploading ? 'Processing...' : (
                            <>
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Banner
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner._id} className="bg-[#18181b] rounded-xl overflow-hidden border border-[#27272a] group relative">
                        <div className="aspect-video w-full bg-[#09090b] relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={banner.imageUrl}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform flex gap-2">
                                <button
                                    onClick={() => handleDelete(banner._id)}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg py-2 flex items-center justify-center transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-[#18181b] rounded-xl border border-dashed border-[#27272a]">
                        <PhotoIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No banners added yet. Add one to show on the app home screen.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


