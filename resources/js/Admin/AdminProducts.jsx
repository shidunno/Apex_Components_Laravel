import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit3, Tag, DollarSign, Layers } from 'lucide-react';
import AdminSidebar from '../Components/Adminsidebar';

const initialProducts = [
  { id: 'cpu-1', name: 'Core Ultra 9 285K Processor', category: 'CPU', price: 589.00, stock: 15, power: 125, badge: '24 Cores / 5.7GHz', type: 'Component', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80' },
  { id: 'cpu-2', name: 'AMD Ryzen 9 9950X', category: 'CPU', price: 649.00, stock: 12, power: 170, badge: '16 Cores / 5.7GHz', type: 'Component', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80' },
  { id: 'cpu-3', name: 'Core Ultra 7 265K', category: 'CPU', price: 399.00, stock: 20, power: 125, badge: '20 Cores / 5.5GHz', type: 'Component', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80' },
  { id: 'mb-1', name: 'Cyberpunk Motherboard Z890', category: 'Motherboard', price: 399.00, stock: 10, power: 35, badge: 'LGA 1851 • DDR5', type: 'Component', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' },
  { id: 'mb-2', name: 'ROG Maximus X870 Hero', category: 'Motherboard', price: 499.00, stock: 8, power: 40, badge: 'AM5 • Wi-Fi 7', type: 'Component', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80' },
  { id: 'mb-3', name: 'TUF Gaming B850-PLUS', category: 'Motherboard', price: 219.00, stock: 14, power: 30, badge: 'AM5 • PCIe 5.0', type: 'Component', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' },
  { id: 'gpu-1', name: 'Apex Titan RTX 5090 OC', category: 'GPU', price: 1999.00, stock: 5, power: 450, badge: '32GB GDDR7 • Triple Fan', type: 'Component', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80' },
  { id: 'gpu-2', name: 'Apex GeForce RTX 5080', category: 'GPU', price: 1199.00, stock: 9, power: 320, badge: '16GB GDDR7 • RGB Shroud', type: 'Component', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80' },
  { id: 'gpu-3', name: 'Radeon RX 9900 XTX', category: 'GPU', price: 999.00, stock: 11, power: 350, badge: '24GB GDDR6 • Vapor Chamber', type: 'Component', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80' },
  { id: 'ram-1', name: 'Dominator Titanium 64GB DDR5', category: 'RAM', price: 249.00, stock: 25, power: 15, badge: '6000MHz CL30 RGB', type: 'Component', image: 'https://images.unsplash.com/photo-1562976540-1e02c414c14d?auto=format&fit=crop&w=500&q=80' },
  { id: 'ram-2', name: 'Vengeance RGB 32GB DDR5', category: 'RAM', price: 129.00, stock: 30, power: 12, badge: '5600MHz CL36', type: 'Component', image: 'https://images.unsplash.com/photo-1562976540-1e02c414c14d?auto=format&fit=crop&w=500&q=80' },
  { id: 'cool-1', name: 'HydroShift Liquid Cooler 360', category: 'Cooling', price: 219.00, stock: 18, power: 20, badge: '360mm ARGB Radiator', type: 'Component', image: 'https://images.unsplash.com/photo-1610465299993-82674c31f457?auto=format&fit=crop&w=500&q=80' },
  { id: 'cool-2', name: 'Kraken Elite 280 RGB AIO', category: 'Cooling', price: 249.00, stock: 12, power: 22, badge: 'LCD Pump Display', type: 'Component', image: 'https://images.unsplash.com/photo-1610465299993-82674c31f457?auto=format&fit=crop&w=500&q=80' },
  { id: 'case-1', name: 'O11 Dynamic EVO XL Tower', category: 'Case', price: 239.00, stock: 15, power: 10, badge: 'Dual Chamber Tempered Glass', type: 'Component', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' },
  { id: 'case-2', name: 'Corsair 5000D Airflow', category: 'Case', price: 174.00, stock: 22, power: 10, badge: 'High-Airflow Mid-Tower', type: 'Component', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' },
  { id: 'pc-1', name: 'Apex Phantom Elite PC', category: 'Prebuilt', price: 3499.00, stock: 4, power: 655, badge: 'RTX 5090 • Full System', type: 'Pre-Built Rig', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' },
  { id: 'pc-2', name: 'Apex Nebula Pulse PC', category: 'Prebuilt', price: 2199.00, stock: 7, power: 574, badge: 'RTX 5080 • Full System', type: 'Pre-Built Rig', image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=500&q=80' }
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);

  // Form state for adding or editing a product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'CPU',
    price: '',
    stock: '',
    image: ''
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing an existing item

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('apex_catalog_products') || JSON.stringify(initialProducts));
    setProducts(storedProducts);

    setOrders(JSON.parse(localStorage.getItem('pc_orders') || '[]'));
    setRegisteredUsers(JSON.parse(localStorage.getItem('apex_registered_users') || '[]'));
    setSupportTickets(JSON.parse(localStorage.getItem('apex_support_tickets') || '[]'));
  }, []);

  const saveProducts = (updatedList) => {
    setProducts(updatedList);
    localStorage.setItem('apex_catalog_products', JSON.stringify(updatedList));
    
    // Broadcast change so user-facing components update instantly
    window.dispatchEvent(new Event('apex_products_updated'));
  };

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
      // Update existing product
      const updated = products.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: parseFloat(productForm.price),
            stock: parseInt(productForm.stock),
            type: productForm.category === 'Prebuilt' ? 'Pre-Built Rig' : 'Component',
            image: productForm.image || p.image
          };
        }
        return p;
      });
      saveProducts(updated);
    } else {
      // Create new product
      const productToAdd = {
        id: 'custom-' + Date.now(),
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        power: 150,
        badge: `${productForm.stock} units in stock`,
        type: productForm.category === 'Prebuilt' ? 'Pre-Built Rig' : 'Component',
        image: productForm.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      };

      const updated = [productToAdd, ...products];
      saveProducts(updated);
    }

    // Reset and close form
    setProductForm({ name: '', category: 'CPU', price: '', stock: '', image: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter(p => p.id !== id);
      saveProducts(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Sidebar */}
      <AdminSidebar 
        ordersCount={orders.length} 
        usersCount={registeredUsers.length} 
        supportCount={supportTickets.filter(t => t.status === 'Pending').length} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Catalog & Inventory Management</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Add, edit, monitor, and remove parts available in the store catalog.</p>
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
              <span>{editingId ? 'Edit Hardware Component Details' : 'New Hardware Component Details'}</span>
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
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Price ($)</label>
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
              <span>Current Inventory Catalog</span>
            </h2>
            <span className="text-xs text-neutral-400">{products.length} total items</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No products available in the catalog.</p>
              <p className="text-neutral-600">Click "Add New Product" above to populate your inventory.</p>
            </div>
          ) : (
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
                  {products.map((product) => (
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
                        ${Number(product.price).toFixed(2)}
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
                          onClick={() => handleDeleteProduct(product.id)}
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
          )}
        </div>

      </main>
    </div>
  );
}