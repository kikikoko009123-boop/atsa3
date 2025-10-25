import { useState } from 'react';
import { doc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useServices } from '../hooks/useServices';
import { useMaterials } from '../hooks/useMaterials';
import { useHeroContent } from '../hooks/useHeroContent';
import { Edit2, Trash2, Plus, Save, X, Zap, Shield, CheckCircle } from 'lucide-react';

export function AdminContentEditor() {
  const { services, loading: servicesLoading } = useServices();
  const { materials, loading: materialsLoading } = useMaterials();
  const { heroContent, loading: heroLoading } = useHeroContent();

  const [editingHero, setEditingHero] = useState(false);
  const [heroForm, setHeroForm] = useState(heroContent);

  const [editingService, setEditingService] = useState<any>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    icon: 'CheckCircle',
    orderIndex: 0
  });

  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    orderIndex: 0
  });

  const handleSaveHero = async () => {
    try {
      await setDoc(doc(db, 'hero', 'main'), {
        title: heroForm.title,
        subtitle: heroForm.subtitle,
        description: heroForm.description
      });
      setEditingHero(false);
    } catch (error) {
      console.error('Error updating hero:', error);
      alert('Failed to update hero content');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), serviceForm);
      } else {
        await addDoc(collection(db, 'services'), serviceForm);
      }
      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({ title: '', description: '', imageUrl: '', icon: 'CheckCircle', orderIndex: 0 });
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await updateDoc(doc(db, 'materials', editingMaterial.id), materialForm);
      } else {
        await addDoc(collection(db, 'materials'), materialForm);
      }
      setShowMaterialModal(false);
      setEditingMaterial(null);
      setMaterialForm({ name: '', orderIndex: 0 });
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Failed to save material');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteDoc(doc(db, 'materials', id));
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material');
      }
    }
  };

  const iconOptions = [
    { value: 'Zap', label: 'Zap', icon: Zap },
    { value: 'Shield', label: 'Shield', icon: Shield },
    { value: 'CheckCircle', label: 'Check Circle', icon: CheckCircle }
  ];

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#3d4f5c]">Hero Section</h2>
          {!editingHero ? (
            <button
              onClick={() => {
                setHeroForm(heroContent);
                setEditingHero(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveHero}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingHero(false);
                  setHeroForm(heroContent);
                }}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingHero ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-lg font-semibold text-gray-800">{heroContent.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Subtitle</p>
              <p className="text-gray-700">{heroContent.subtitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{heroContent.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#3d4f5c]">Services</h2>
          <button
            onClick={() => {
              setEditingService(null);
              setServiceForm({ title: '', description: '', imageUrl: '', icon: 'CheckCircle', orderIndex: services.length + 1 });
              setShowServiceModal(true);
            }}
            className="flex items-center gap-2 bg-[#3d4f5c] text-white px-4 py-2 rounded-lg hover:bg-[#2d3f4c] transition"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {servicesLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <img src={service.imageUrl} alt={service.title} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#3d4f5c]">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Icon: {service.icon} | Order: {service.orderIndex}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setServiceForm({
                        title: service.title,
                        description: service.description,
                        imageUrl: service.imageUrl,
                        icon: service.icon,
                        orderIndex: service.orderIndex
                      });
                      setShowServiceModal(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#3d4f5c]">Materials</h2>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setMaterialForm({ name: '', orderIndex: materials.length + 1 });
              setShowMaterialModal(true);
            }}
            className="flex items-center gap-2 bg-[#3d4f5c] text-white px-4 py-2 rounded-lg hover:bg-[#2d3f4c] transition"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </button>
        </div>

        {materialsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {materials.map((material) => (
              <div key={material.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{material.name}</span>
                  <span className="text-xs text-gray-400 ml-2">Order: {material.orderIndex}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMaterial(material);
                      setMaterialForm({ name: material.name, orderIndex: material.orderIndex });
                      setShowMaterialModal(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-[#3d4f5c] mb-6">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={serviceForm.imageUrl}
                  onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
                {serviceForm.imageUrl && (
                  <img src={serviceForm.imageUrl} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
                <input
                  type="number"
                  value={serviceForm.orderIndex}
                  onChange={(e) => setServiceForm({ ...serviceForm, orderIndex: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#3d4f5c] text-white py-3 rounded-lg font-semibold hover:bg-[#2d3f4c] transition"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
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

      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-[#3d4f5c] mb-6">
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
            </h3>
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
                <input
                  type="text"
                  value={materialForm.name}
                  onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
                <input
                  type="number"
                  value={materialForm.orderIndex}
                  onChange={(e) => setMaterialForm({ ...materialForm, orderIndex: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#3d4f5c] text-white py-3 rounded-lg font-semibold hover:bg-[#2d3f4c] transition"
                >
                  {editingMaterial ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMaterialModal(false);
                    setEditingMaterial(null);
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
    </div>
  );
}
