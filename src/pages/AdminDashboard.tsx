import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToPostimages } from '../services/postimagesUpload';
import { Plus, Edit2, Trash2, LogOut, Home, Upload, X, Image, Sparkles } from 'lucide-react';
import { AdminContentEditor } from '../components/AdminContentEditor';

export function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const { products, loading } = useProducts();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    bio: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [generatingBio, setGeneratingBio] = useState(false);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    console.log('Uploading image to Postimages:', file.name);
    try {
      const directLink = await uploadToPostimages(file);
      console.log('Upload successful, direct link:', directLink);
      setFormData({ ...formData, imageUrl: directLink });
      setUploadedFile(file);
    } catch (error) {
      console.error('Error uploading image to Postimages:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        console.log('Updating product:', editingProduct.id);
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...formData,
          updatedAt: Date.now()
        });
        console.log('Product updated successfully');
      } else {
        console.log('Adding new product:', formData);
        await addDoc(collection(db, 'products'), {
          ...formData,
          slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          createdAt: Date.now()
        });
        console.log('Product added successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', imageUrl: '', bio: '' });
      setUploadedFile(null);
    } catch (error) {
      console.error('Error saving product to Firestore:', error);
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleEdit = (product: any) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl || '',
      bio: product.bio || ''
    });
    setUploadedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('Deleting product:', id);
        await deleteDoc(doc(db, 'products', id));
        console.log('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product from Firestore:', error);
        alert('Failed to delete product. Check console for details.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogoChange = async () => {
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        logoUrl: logoUrl
      });
      setShowLogoModal(false);
      setLogoUrl('');
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo. Check console for details.');
    }
  };

  const generateBio = async () => {
    if (!formData.name || !formData.description) {
      alert('Please provide product name and description first');
      return;
    }

    setGeneratingBio(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional copywriter specializing in industrial and manufacturing products. Create compelling, detailed product bios that highlight features, benefits, and applications.'
            },
            {
              role: 'user',
              content: `Create a detailed product bio for: ${formData.name}\n\nDescription: ${formData.description}\n\nProvide a comprehensive bio that emphasizes quality, craftsmanship, and practical applications.`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate bio');
      }

      const data = await response.json();
      const generatedBio = data.choices[0].message.content;
      setFormData({ ...formData, bio: generatedBio });
    } catch (error) {
      console.error('Error generating bio:', error);
      alert('Failed to generate bio. Make sure VITE_OPENAI_API_KEY is set in your .env file.');
    } finally {
      setGeneratingBio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl} alt="ATSA Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-bold text-[#3d4f5c]">Admin Dashboard</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#3d4f5c]">Site Settings</h2>
          <button
            onClick={() => {
              setLogoUrl(settings.logoUrl);
              setShowLogoModal(true);
            }}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            <Image className="w-5 h-5" />
            Change Logo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h3 className="text-xl font-bold text-[#3d4f5c] mb-4">Current Logo</h3>
          <img src={settings.logoUrl} alt="Current Logo" className="w-32 h-32 object-contain border border-gray-200 rounded-lg" />
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#3d4f5c] mb-8">Page Content</h2>
          <AdminContentEditor />
        </div>

        <div className="flex justify-between items-center mb-8 mt-12">
          <h2 className="text-3xl font-bold text-[#3d4f5c]">Products</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', description: '', imageUrl: '', bio: '' });
              setUploadedFile(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#3d4f5c] text-white px-6 py-3 rounded-lg hover:bg-[#2d3f4c] transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#3d4f5c] mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-[#3d4f5c] mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Bio (AI Generated)</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={generateBio}
                    disabled={generatingBio}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generatingBio ? 'Generating...' : 'Generate Bio with AI'}
                  </button>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  rows={6}
                  placeholder="AI-generated bio will appear here, or you can write your own..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition ${
                    dragActive ? 'border-[#3d4f5c] bg-slate-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  {formData.imageUrl ? (
                    <div className="space-y-3">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="mx-auto h-40 w-auto rounded-lg object-cover"
                      />
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#3d4f5c] text-white rounded-lg hover:bg-[#2d3f4c] transition text-sm"
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '' });
                            setUploadedFile(null);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[#3d4f5c] hover:underline font-medium"
                        >
                          Click to upload
                        </button>
                        <span className="text-gray-600"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="w-8 h-8 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Or paste image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#3d4f5c] text-white py-3 rounded-lg font-semibold hover:bg-[#2d3f4c] transition"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({ name: '', description: '', imageUrl: '', bio: '' });
                    setUploadedFile(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-[#3d4f5c] mb-6">Change Logo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {logoUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img src={logoUrl} alt="Logo Preview" className="w-32 h-32 object-contain border border-gray-200 rounded-lg" />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleLogoChange}
                  className="flex-1 bg-[#3d4f5c] text-white py-3 rounded-lg font-semibold hover:bg-[#2d3f4c] transition"
                >
                  Update Logo
                </button>
                <button
                  onClick={() => {
                    setShowLogoModal(false);
                    setLogoUrl('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
