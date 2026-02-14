'use client';

import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import { uploadImage } from '../../services/imageService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    PencilIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function SubCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);

    const [name, setName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');

    useEffect(() => {
        fetchMainCategories();
        fetchSubCategories();
    }, []);

    const fetchMainCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchSubCategories = async () => {
        try {
            const data = await subCategoryService.getSubCategories();
            setSubCategories(data);
        } catch (error) {
            toast.error('Failed to fetch sub-categories');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !selectedCategoryId) {
            toast.error('Name and Main Category are required');
            return;
        }

        setLoading(true);
        try {
            let finalImageUrl = existingImageUrl;
            if (imageFile) {
                const url = await uploadImage(imageFile, 'subcategories');
                if (url) finalImageUrl = url;
            }

            if (isEditing && editId) {
                await subCategoryService.updateSubCategory(editId, {
                    name,
                    mainCategoryId: selectedCategoryId,
                    imageUrl: finalImageUrl
                });
                toast.success('Sub-Category updated successfully');
            } else {
                await subCategoryService.createSubCategory({
                    name,
                    mainCategoryId: selectedCategoryId,
                    imageUrl: finalImageUrl
                });
                toast.success('Sub-Category created successfully');
            }

            resetForm();
            fetchSubCategories();
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update sub-category' : 'Failed to create sub-category');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (subCat: any) => {
        setIsEditing(true);
        setEditId(subCat._id);
        setName(subCat.name);
        // Handle both populated object or direct ID for mainCategoryId
        const mainCatId = typeof subCat.mainCategoryId === 'object' ? subCat.mainCategoryId._id : subCat.mainCategoryId;
        setSelectedCategoryId(mainCatId);
        setExistingImageUrl(subCat.imageUrl || '');
        setImagePreview(subCat.imageUrl || null);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this sub-category?')) {
            try {
                await subCategoryService.deleteSubCategory(id);
                toast.success('Sub-Category deleted');
                fetchSubCategories();
            } catch (error) {
                toast.error('Failed to delete sub-category');
            }
        }
    };

    const resetForm = () => {
        setName('');
        setSelectedCategoryId('');
        setImageFile(null);
        setImagePreview(null);
        setIsEditing(false);
        setEditId(null);
        setExistingImageUrl('');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Sub-Categories
                    </h1>
                    <p className="text-gray-400 mt-1">Organize products into sub-groups</p>
                </div>
            </div>

            {/* Form Section */}
            <div className={`bg-[#111113] border border-[#27272a] rounded-2xl p-6 shadow-sm ${isEditing ? 'border-purple-500/50' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-white flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${isEditing ? 'bg-yellow-500/10' : 'bg-purple-500/10'}`}>
                            {isEditing ? <PencilIcon className="w-5 h-5 text-yellow-500" /> : <PlusIcon className="w-5 h-5 text-purple-500" />}
                        </div>
                        {isEditing ? 'Edit Sub-Category' : 'Add New Sub-Category'}
                    </h2>
                    {isEditing && (
                        <button onClick={resetForm} className="text-gray-400 hover:text-white flex items-center text-sm">
                            <XMarkIcon className="w-4 h-4 mr-1" /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Main Category</label>
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            >
                                <option value="">Select Main Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Sub-Category Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                                placeholder="e.g., Portrait, Landscape"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image (Optional)</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 cursor-pointer group">
                                    <div className="flex items-center justify-center w-full px-4 py-3 bg-[#09090b] border border-[#27272a] border-dashed rounded-xl group-hover:border-purple-500 transition-colors">
                                        <PhotoIcon className="w-5 h-5 text-gray-500 group-hover:text-purple-500 mr-2" />
                                        <span className="text-gray-500 group-hover:text-purple-500 transition-colors">
                                            {imageFile ? imageFile.name : (isEditing ? 'Change Image' : 'Choose Image')}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                                {imagePreview && (
                                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-[#27272a]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl font-medium shadow-lg transition-all ${isEditing
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-900/20'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/20'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : (isEditing ? 'Update Sub-Category' : 'Create Sub-Category')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sub-Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subCategories.map((subCat) => (
                    <div key={subCat._id} className="group relative bg-[#111113] border border-[#27272a] rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300">
                        {/* Edit Button */}
                        <button
                            onClick={() => handleEdit(subCat)}
                            className="absolute top-3 right-3 z-10 p-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>

                        <div className="aspect-w-16 aspect-h-9 w-full h-40 relative overflow-hidden bg-gray-800">
                            {subCat.imageUrl && subCat.imageUrl.length > 0 ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={subCat.imageUrl}
                                    alt={subCat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <PhotoIcon className="w-10 h-10" />
                                </div>
                            )}

                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(subCat._id)}
                                    className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all duration-300"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#27272a]">
                            <h3 className="text-lg font-bold text-white truncate">{subCat.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 truncate">
                                Parent: {subCat.mainCategoryId?.name || 'Unknown'}
                            </p>
                        </div>
                    </div>
                ))}
                {subCategories.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#27272a] rounded-2xl">
                        <PhotoIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>No sub-categories found. Create one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
