import { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Search, SlidersHorizontal, Trash2, ArrowRight, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

// Combined default products including ALL items from Builder.jsx + extras
const defaultProducts = [
  // CPUs
  { 
    id: 'cpu-1', 
    name: 'Core Ultra 9 285K Processor', 
    category: 'cpu', 
    price: 589.00, 
    power: 125, 
    badge: '24 Cores / 5.7GHz', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'cpu-2', 
    name: 'AMD Ryzen 9 9950X', 
    category: 'cpu', 
    price: 649.00, 
    power: 170, 
    badge: '16 Cores / 5.7GHz', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'cpu-3', 
    name: 'Core Ultra 7 265K', 
    category: 'cpu', 
    price: 399.00, 
    power: 125, 
    badge: '20 Cores / 5.5GHz', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80' 
  },

  // Motherboards
  { 
    id: 'mb-1', 
    name: 'Cyberpunk Motherboard Z890', 
    category: 'motherboard', 
    price: 399.00, 
    power: 35, 
    badge: 'LGA 1851 • DDR5', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'mb-2', 
    name: 'ROG Maximus X870 Hero', 
    category: 'motherboard', 
    price: 499.00, 
    power: 40, 
    badge: 'AM5 • Wi-Fi 7', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'mb-3', 
    name: 'TUF Gaming B850-PLUS', 
    category: 'motherboard', 
    price: 219.00, 
    power: 30, 
    badge: 'AM5 • PCIe 5.0', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' 
  },

  // GPUs
  { 
    id: 'gpu-1', 
    name: 'Apex Titan RTX 5090 OC', 
    category: 'gpu', 
    price: 1999.00, 
    power: 450, 
    badge: '32GB GDDR7 • Triple Fan', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'gpu-2', 
    name: 'Apex GeForce RTX 5080', 
    category: 'gpu', 
    price: 1199.00, 
    power: 320, 
    badge: '16GB GDDR7 • RGB Shroud', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'gpu-3', 
    name: 'Radeon RX 9900 XTX', 
    category: 'gpu', 
    price: 999.00, 
    power: 350, 
    badge: '24GB GDDR6 • Vapor Chamber', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80' 
  },

  // RAM
  { 
    id: 'ram-1', 
    name: 'Dominator Titanium 64GB DDR5', 
    category: 'ram', 
    price: 249.00, 
    power: 15, 
    badge: '6000MHz CL30 RGB', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1562976540-1e02c414c14d?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'ram-2', 
    name: 'Vengeance RGB 32GB DDR5', 
    category: 'ram', 
    price: 129.00, 
    power: 12, 
    badge: '5600MHz CL36', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1562976540-1e02c414c14d?auto=format&fit=crop&w=500&q=80' 
  },

  // Cooling
  { 
    id: 'cool-1', 
    name: 'HydroShift Liquid Cooler 360', 
    category: 'cooling', 
    price: 219.00, 
    power: 20, 
    badge: '360mm ARGB Radiator', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1610465299993-82674c31f457?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'cool-2', 
    name: 'Kraken Elite 280 RGB AIO', 
    category: 'cooling', 
    price: 249.00, 
    power: 22, 
    badge: 'LCD Pump Display', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1610465299993-82674c31f457?auto=format&fit=crop&w=500&q=80' 
  },

  // Cases
  { 
    id: 'case-1', 
    name: 'O11 Dynamic EVO XL Tower', 
    category: 'case', 
    price: 239.00, 
    power: 10, 
    badge: 'Dual Chamber Tempered Glass', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'case-2', 
    name: 'Corsair 5000D Airflow', 
    category: 'case', 
    price: 174.00, 
    power: 10, 
    badge: 'High-Airflow Mid-Tower', 
    type: 'Component',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' 
  },

  // Pre-builts
  { 
    id: 'pc-1', 
    name: 'Apex Phantom Elite PC', 
    category: 'prebuilt', 
    price: 3499.00, 
    power: 655, 
    badge: 'RTX 5090 • Full System', 
    type: 'Pre-Built Rig',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'pc-2', 
    name: 'Apex Nebula Pulse PC', 
    category: 'prebuilt', 
    price: 2199.00, 
    power: 574, 
    badge: 'RTX 5080 • Full System', 
    type: 'Pre-Built Rig',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=500&q=80' 
  }
];

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState([]);
  
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const loadCatalogData = () => {
      const storedProducts = JSON.parse(localStorage.getItem('apex_catalog_products') || JSON.stringify(defaultProducts));
      
      const normalizedProducts = storedProducts.map(p => ({
        ...p,
        category: p.category ? p.category.toLowerCase() : 'cpu',
        power: p.power || 150,
        badge: p.badge || (p.stock !== undefined ? `${p.stock} units in stock` : 'In Stock'),
        type: p.type || 'Component',
        image: p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      }));

      setProducts(normalizedProducts);
    };

    // Initial load
    loadCatalogData();

    // Listen for custom event triggered when admin saves/updates products
    window.addEventListener('apex_products_updated', loadCatalogData);

    const existingCart = JSON.parse(localStorage.getItem('pc_cart') || '[]');
    setCartItems(existingCart);

    const existingWishlist = JSON.parse(localStorage.getItem('apex_wishlist') || '[]');
    setWishlistItems(existingWishlist);

    return () => {
      window.removeEventListener('apex_products_updated', loadCatalogData);
    };
  }, []);

  const saveAndSyncCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('pc_cart', JSON.stringify(updatedCart));
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    let updatedWishlist;
    
    if (exists) {
      updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlistItems, product];
    }

    setWishlistItems(updatedWishlist);
    localStorage.setItem('apex_wishlist', JSON.stringify(updatedWishlist));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.badge && product.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    const cartItem = {
      id: Date.now() + Math.random(),
      date: new Date().toLocaleDateString(),
      parts: { [product.category]: product },
      totalPrice: Number(product.price),
      totalPower: product.power,
      recommendedPSU: Math.ceil((product.power * 1.3) / 50) * 50 || 500,
      name: product.name,
      image: product.image,
      isSinglePart: product.type === 'Component'
    };

    const updatedCart = [...cartItems, cartItem];
    saveAndSyncCart(updatedCart);

    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    saveAndSyncCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'cpu', label: 'Processors (CPU)' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'gpu', label: 'Graphics Cards (GPU)' },
    { id: 'ram', label: 'Memory (RAM)' },
    { id: 'cooling', label: 'Cooling' },
    { id: 'case', label: 'Chassis / Case' },
    { id: 'prebuilt', label: 'Pre-Built Rigs' }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative">
      <Navbar />
      
      <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 flex-1 pt-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Product Catalog & Store</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Browse individual builder components or complete pre-built desktop systems.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Search components or PCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161619] border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <button 
              onClick={() => navigate('/wishlist')}
              className="relative bg-[#161619] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 p-2.5 rounded-xl text-neutral-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#121215]">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#161619] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 p-2.5 rounded-xl text-neutral-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Open Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#121215]">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-[#161619] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#161619] border border-neutral-800 rounded-3xl space-y-3">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-neutral-600" />
            <h3 className="text-sm font-bold text-white">No products found</h3>
            <p className="text-xs text-neutral-400">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isJustAdded = addedIds.includes(product.id);
              const isWishlisted = wishlistItems.some(item => item.id === product.id);
              return (
                <div 
                  key={product.id}
                  className="bg-[#161619] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl transition-all hover:border-neutral-700 relative"
                >
                  <div>
                    <div className="w-full h-48 bg-[#1f1f23] relative overflow-hidden border-b border-neutral-800">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-purple-500/30 shadow-md">
                          {product.type}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-md z-10 ${
                          isWishlisted 
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
                            : 'bg-neutral-950/80 border-neutral-700/50 text-neutral-300 hover:text-white hover:bg-neutral-900'
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>

                      <div className="absolute bottom-3 right-3">
                        <span className="text-[11px] font-semibold text-neutral-200 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700/50 shadow-md">
                          {product.power}W
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="text-sm font-bold text-white">{product.name}</h3>
                      <p className="text-[11px] text-neutral-400">{product.badge}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-neutral-800/60 mt-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">Price</span>
                      <span className="text-xl font-black text-white">${Number(product.price).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 cursor-pointer ${
                        isJustAdded 
                          ? 'bg-emerald-600 text-white shadow-emerald-900/40' 
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white shadow-purple-900/40'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
      <Footer />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#121215] border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
              
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                  <span className="bg-purple-900/50 text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                    {cartItems.length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <ShoppingCart className="w-12 h-12 mx-auto text-neutral-700" />
                    <p className="text-sm font-bold text-neutral-300">Your cart is empty</p>
                    <p className="text-xs text-neutral-500">Add components or rigs from the catalog to begin your order.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-[#161619] border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md"
                    >
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-xl border border-neutral-800 shrink-0" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                          ${(item.totalPrice || 0).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-neutral-800 bg-[#161619] space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-medium">Subtotal</span>
                    <span className="text-lg font-black text-white">${calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 transition-all cursor-pointer text-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}