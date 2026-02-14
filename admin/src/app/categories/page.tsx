'use client';

import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import { uploadImage } from '../../services/imageService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    TrashIcon,
    PhotoIcon,
    PencilIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
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

        if (!name) {
            toast.error('Name is required');
            return;
        }

        if (!isEditing && !imageFile) {
            toast.error('Image is required for new category');
            return;
        }

        setLoading(true);
        try {
            let finalImageUrl = existingImageUrl;

            if (imageFile) {
                const url = await uploadImage(imageFile, 'categories');
                if (url) finalImageUrl = url;
            }

            if (isEditing && editId) {
                await categoryService.updateCategory(editId, {
                    name,
                    imageUrl: finalImageUrl
                });
                toast.success('Category updated successfully');
            } else {
                await categoryService.createCategory({ name, imageUrl: finalImageUrl });
                toast.success('Category created successfully');
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setIsEditing(true);
        setEditId(category._id);
        setName(category.name);
        setExistingImageUrl(category.imageUrl);
        setImagePreview(category.imageUrl);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const resetForm = () => {
        setName('');
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
                        Categories
                    </h1>
                    <p className="text-gray-400 mt-1">Manage your main product categories</p>
                </div>
            </div>

            {/* Form Section */}
            <div className={`bg-[#111113] border border-[#27272a] rounded-2xl p-6 shadow-sm ${isEditing ? 'border-blue-500/50' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-white flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${isEditing ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
                            {isEditing ? <PencilIcon className="w-5 h-5 text-yellow-500" /> : <PlusIcon className="w-5 h-5 text-blue-500" />}
                        </div>
                        {isEditing ? 'Edit Category' : 'Add New Category'}
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
                            <label className="block text-sm font-medium text-gray-400 mb-2">Category Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                placeholder="e.g., Photography, AI Art, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 cursor-pointer group">
                                    <div className="flex items-center justify-center w-full px-4 py-3 bg-[#09090b] border border-[#27272a] border-dashed rounded-xl group-hover:border-blue-500 transition-colors">
                                        <PhotoIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 mr-2" />
                                        <span className="text-gray-500 group-hover:text-blue-500 transition-colors">
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
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : (isEditing ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="group relative bg-[#111113] border border-[#27272a] rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300">
                        {/* Edit Button */}
                        <button
                            onClick={() => handleEdit(category)}
                            className="absolute top-3 right-12 z-10 p-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>

                        <div className="aspect-w-16 aspect-h-9 w-full h-48 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h3 className="text-lg font-bold text-white truncate">{category.name}</h3>
                            </div>

                            <button
                                onClick={() => handleDelete(category._id)}
                                className="absolute top-3 right-3 p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#27272a] rounded-2xl">
                        <PhotoIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>No categories found. Create one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
