import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Package, Plus, Trash2, Edit3, Layers, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../../Components/AdminSidebar.jsx';

// Single place to format prices as Philippine Peso
const formatPeso = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function AdminProducts({ products: initialProducts = [], ordersCount = 0 }) {
  const [products, setProducts] = useState(initialProducts);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form state for adding or editing a product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'CPU',
    price: '',
    stock: '',
    image: ''
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setProductForm({ name: '', category: 'CPU', price: '', stock: '', image: '' });
    setIsAdding(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'CPU',
      price: product.price || '',
      stock: product.stock !== undefined ? product.stock : 10,
      image: product.image || ''
    });
    setIsAdding(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;

    if (editingId) {
      router.put(`/admin/products/${editingId}`, {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        image: productForm.image
      }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          // Instantly sync local state from updated Inertia page props if available
          if (page.props.products) {
            setProducts(page.props.products);
          }
          setProductForm({ name: '', category: 'CPU', price: '', stock: '', image: '' });
          setEditingId(null);
          setIsAdding(false);
        },
        onError: (errors) => {
          console.error('Validation or update errors:', errors);
          alert('Failed to update product. Check console for details.');
        }
      });
    } else {
      router.post('/admin/products', {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        image: productForm.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          if (page.props.products) {
            setProducts(page.props.products);
          }
          setProductForm({ name: '', category: 'CPU', price: '', stock: '', image: '' });
          setIsAdding(false);
        },
        onError: (errors) => {
          console.error('Validation or creation errors:', errors);
          alert('Failed to save product. Check console for details.');
        }
      });
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingId) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    try {
      const response = await fetch(`/admin/products/${deletingId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken || ''
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== deletingId));
        setDeletingId(null);
        router.reload({ preserveScroll: true, preserveState: true });
      } else {
        const errData = await response.json();
        console.error('Failed to delete product:', errData);
        alert('Delete failed. Check console for details.');
        setDeletingId(null);
      }
    } catch (error) {
      console.error('Network or fetch error while deleting product:', error);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Sidebar */}
      <AdminSidebar ordersCount={ordersCount} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Catalog & Inventory Management</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Add, edit, monitor, and remove parts available in the database store catalog.</p>
          </div>
          
          <button
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
              } else {
                handleOpenAddForm();
              }
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close Form' : 'Add New Product'}</span>
          </button>
        </div>

        {/* Add / Edit Product Form Modal / Accordion */}
        {isAdding && (
          <div className="bg-[#161619] border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span>{editingId ? 'Edit Database Hardware Component' : 'New Database Hardware Component'}</span>
            </h2>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Intel Core i7-14700K"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="CPU">CPU (Processor)</option>
                  <option value="Motherboard">Motherboard</option>
                  <option value="GPU">GPU (Graphics Card)</option>
                  <option value="RAM">RAM (Memory)</option>
                  <option value="Storage">Storage (SSD/HDD)</option>
                  <option value="Cooling">CPU Cooling</option>
                  <option value="Case">PC Case</option>
                  <option value="Prebuilt">Pre-Built Rig</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Price (₱)</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Stock Quantity</label>
                <input 
                  type="number"
                  required
                  placeholder="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Image URL (Optional)</label>
                <input 
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table Container */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Database Inventory Catalog</span>
            </h2>
            <span className="text-xs text-neutral-400">
              Showing {products.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length} items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No products available in the database.</p>
              <p className="text-neutral-600">Click "Add New Product" above to populate your inventory.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Component Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-white flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                            <img 
                              src={product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=100&q=80'} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span>{product.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-lg font-mono text-[10px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                          {formatPeso(product.price)}
                        </td>
                        <td className="py-4 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            (product.stock || 10) > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {product.stock !== undefined ? product.stock : 10} units
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(product)}
                            className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(product.id)}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1 transition-all ${
                        currentPage === 1
                          ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-[#121215] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1 transition-all ${
                        currentPage === totalPages
                          ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-[#121215] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Delete Product?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to remove this hardware component from the database catalog? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-900/40"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}