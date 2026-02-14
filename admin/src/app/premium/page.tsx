'use client';

import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { uploadImage } from '../../services/imageService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const PremiumProductModal = ({ isOpen, onClose, onSubmit, loading }: any) => {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Force isPremium to true and no categories
        onSubmit({
            title,
            prompt,
            mainCategoryId: undefined,
            subCategoryId: undefined,
            isPremium: true,
            imageFile
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111113] border border-[#27272a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-[#27272a] flex justify-between items-center bg-[#111113]">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-yellow-500" />
                        Add Premium Content
                    </h2>
                    <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#27272a] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[#111113]">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all"
                            placeholder="e.g., Exclusive 8K Portrait"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Prompt Text</label>
                        <textarea
                            required
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all"
                            placeholder="Enter the premium prompt here..."
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Preview Image</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 cursor-pointer group">
                                    <div className="flex items-center justify-center w-full px-4 py-3 bg-[#09090b] border border-[#27272a] border-dashed rounded-xl group-hover:border-yellow-500 transition-colors">
                                        <PhotoIcon className="w-5 h-5 text-gray-500 group-hover:text-yellow-500 mr-2" />
                                        <span className="text-gray-500 group-hover:text-yellow-500 transition-colors">
                                            {imageFile ? imageFile.name : 'Choose Image'}
                                        </span>
                                    </div>
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" required />
                                </label>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="h-20 w-20 rounded-lg overflow-hidden border border-[#27272a] mt-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl hover:bg-[#27272a] text-white transition-all">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-xl font-medium shadow-lg shadow-yellow-900/20 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create Premium Content'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function PremiumPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const fetchProducts = async () => {
        try {
            // Fetch ONLY premium products
            const data = await productService.getProducts(page, '', 'premium');
            setProducts(data.products);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            toast.error('Failed to fetch premium content');
        }
    };

    const handleCreateProduct = async (productData: any) => {
        setLoading(true);
        try {
            const imageUrl = await uploadImage(productData.imageFile, 'premium');
            await productService.createProduct({
                ...productData,
                imageUrl,
            });
            toast.success('Premium Content created successfully');
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create content');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this premium content?')) {
            try {
                await productService.deleteProduct(id);
                toast.success('Content deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete content');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">
                        Premium Content
                    </h1>
                    <p className="text-gray-400 mt-1">Manage exclusive paid content</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-5 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-xl font-medium shadow-lg shadow-yellow-900/20 transition-all"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Premium
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="group relative bg-[#111113] border border-yellow-500/20 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 flex flex-col shadow-lg shadow-yellow-900/5">
                        <div className="aspect-w-1 aspect-h-1 w-full relative overflow-hidden bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded shadow-lg backdrop-blur-sm flex items-center">
                                <SparklesIcon className="w-3 h-3 mr-1" />
                                PREMIUM
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all duration-300"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-white line-clamp-1">{product.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.prompt}</p>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border border-dashed border-yellow-500/20 rounded-2xl">
                        <SparklesIcon className="w-12 h-12 mb-3 opacity-20 text-yellow-500" />
                        <p>No premium content found. Create one above.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(pages).keys()].map(x => (
                        <button
                            key={x + 1}
                            onClick={() => setPage(x + 1)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === x + 1
                                ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20'
                                : 'bg-[#111113] border border-[#27272a] text-gray-400 hover:bg-[#27272a] hover:text-white'
                                }`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}

            <PremiumProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProduct}
                loading={loading}
            />
        </div>
    );
}
