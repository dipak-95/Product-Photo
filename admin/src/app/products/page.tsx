'use client';

import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import { uploadImage } from '../../services/imageService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const ProductModal = ({ isOpen, onClose, categories, subCategories, onSubmit, loading }: any) => {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [mainCategoryId, setMainCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setPrompt('');
            setMainCategoryId('');
            setSubCategoryId('');
            setIsPremium(false);
            setImageFile(null);
            setImagePreview(null);
        }
    }, [isOpen]);

    // Filter sub-categories based on main category
    const filteredSubCategories = subCategories.filter((sub: any) => sub.mainCategoryId === mainCategoryId || sub.mainCategoryId._id === mainCategoryId);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, prompt, mainCategoryId, subCategoryId, isPremium, imageFile });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111113] border border-[#27272a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-[#27272a] flex justify-between items-center bg-[#111113]">
                    <h2 className="text-xl font-bold text-white">Add New Product</h2>
                    <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#27272a] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[#111113]">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Product Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="e.g., Cyberpunk City Generation"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Prompt Text</label>
                        <textarea
                            required
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="Enter the AI prompt here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Main Category</label>
                            <select
                                required
                                value={mainCategoryId}
                                onChange={(e) => {
                                    setMainCategoryId(e.target.value);
                                    setSubCategoryId('');
                                }}
                                className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                            >
                                <option value="">Select Main Category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Sub-Category (Optional)</label>
                            <select
                                value={subCategoryId}
                                onChange={(e) => setSubCategoryId(e.target.value)}
                                className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                                disabled={!mainCategoryId}
                            >
                                <option value="">Select Sub-Category</option>
                                {filteredSubCategories.map((sub: any) => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 cursor-pointer group">
                                    <div className="flex items-center justify-center w-full px-4 py-3 bg-[#09090b] border border-[#27272a] border-dashed rounded-xl group-hover:border-blue-500 transition-colors">
                                        <PhotoIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 mr-2" />
                                        <span className="text-gray-500 group-hover:text-blue-500 transition-colors">
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

                    <div className="flex items-center space-x-3 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 hidden">
                        <input
                            type="checkbox"
                            checked={isPremium}
                            onChange={(e) => setIsPremium(e.target.checked)}
                            className="h-5 w-5 rounded bg-[#09090b] border-gray-600 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="text-yellow-500 font-medium">Mark as Premium Content</span>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl hover:bg-[#27272a] text-white transition-all">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts(page, '', 'standard');
            setProducts(data.products);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchSubCategories = async () => {
        try {
            const data = await subCategoryService.getSubCategories();
            setSubCategories(data);
        } catch (error) {
            console.error('Failed to fetch sub-categories');
        }
    };

    const handleCreateProduct = async (productData: any) => {
        setLoading(true);
        try {
            const imageUrl = await uploadImage(productData.imageFile, 'products');
            await productService.createProduct({
                ...productData,
                imageUrl,
            });
            toast.success('Product created successfully');
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this product?')) {
            try {
                await productService.deleteProduct(id);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Standard Products
                    </h1>
                    <p className="text-gray-400 mt-1">Manage standard AI prompts</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="group relative bg-[#111113] border border-[#27272a] rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 flex flex-col">
                        <div className="aspect-w-1 aspect-h-1 w-full relative overflow-hidden bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {product.isPremium && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded shadow-lg backdrop-blur-sm">
                                    PREMIUM
                                </div>
                            )}
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

                            <div className="mt-auto pt-4 flex space-x-2">
                                <span className="px-2 py-1 bg-[#27272a] text-gray-300 text-xs rounded-md border border-gray-700">
                                    {(categories.find((c: any) => c._id === product.mainCategoryId) as any)?.name || (categories.find((c: any) => c._id === (product.mainCategoryId as any)?._id) as any)?.name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(pages).keys()].map(x => (
                        <button
                            key={x + 1}
                            onClick={() => setPage(x + 1)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === x + 1
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-[#111113] border border-[#27272a] text-gray-400 hover:bg-[#27272a] hover:text-white'
                                }`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                subCategories={subCategories}
                onSubmit={handleCreateProduct}
                loading={loading}
            />
        </div>
    );
}
