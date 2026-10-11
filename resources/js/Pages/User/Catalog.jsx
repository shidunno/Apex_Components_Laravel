import { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Search, SlidersHorizontal, Trash2, ArrowRight, X, Heart } from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// Font stack that includes glyph support for the peso sign (₱)
const FONT_STACK =
  "'Inter', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

// Single place to format prices as Philippine Peso
const formatPeso = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function Catalog({ products: initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const normalizedProducts = initialProducts.map(p => {
      let catKey = 'all';
      const c = (p.category || '').toLowerCase();
      if (c.includes('processor') || c.includes('cpu')) catKey = 'cpu';
      else if (c.includes('motherboard')) catKey = 'motherboard';
      else if (c.includes('graphic') || c.includes('gpu')) catKey = 'gpu';
      else if (c.includes('memory') || c.includes('ram')) catKey = 'ram';
      else if (c.includes('cooling')) catKey = 'cooling';
      else if (c.includes('chassis') || c.includes('case')) catKey = 'case';
      else if (c.includes('pre-built') || c.includes('rig')) catKey = 'prebuilt';

      return {
        ...p,
        categoryKey: catKey,
        power: p.power || 150,
        badge: p.stock !== undefined ? `${p.stock} units in stock` : 'In Stock',
        type: p.type || 'Component',
        image: p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      };
    });

    setProducts(normalizedProducts);

    // Fetch user-specific wishlist from the backend database
    fetch('/wishlist-items', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .then(data => setWishlistItems(data || []))
      .catch(error => console.error("Could not fetch wishlist from server", error));

    // Fetch user-specific cart from the backend database
    fetch('/cart', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .then(data => setCartItems(data || []))
      .catch(error => console.error("Could not fetch cart from server", error));
  }, [initialProducts]);

  // Auto-open the cart drawer when arriving from the Builder (/catalog?openCart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openCart') === '1') {
      setIsCartOpen(true);
      params.delete('openCart');
      const qs = params.toString();
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + (qs ? `?${qs}` : '')
      );
    }
  }, []);

  const saveAndSyncCart = (updatedCart) => {
    setCartItems(updatedCart);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({ items: updatedCart })
    }).catch(error => console.error("Could not sync cart to server", error));
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (exists) {
      fetch(`/wishlist-items/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        }
      })
        .then(() => {
          setWishlistItems(prev => prev.filter(item => item.id !== product.id));
        })
        .catch(error => console.error("Could not remove item from wishlist", error));
    } else {
      fetch('/wishlist-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(product)
      })
        .then(res => res.json())
        .then(newItem => {
          setWishlistItems(prev => [...prev, newItem]);
        })
        .catch(error => console.error("Could not add item to wishlist", error));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryKey === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    const cartItem = {
      id: Date.now() + Math.random(),
      date: new Date().toLocaleDateString(),
      parts: { [product.categoryKey]: product },
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
    <div
      className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative font-sans"
      style={{ fontFamily: FONT_STACK }}
    >
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
                style={{ fontFamily: 'inherit' }}
                className="w-full bg-[#161619] border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <button
              onClick={() => router.visit('/wishlist')}
              className="relative bg-[#161619] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 p-2.5 rounded-xl text-neutral-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#121215]">
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
                <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#121215]">
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
              style={{ fontFamily: 'inherit' }}
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
            <p className="text-xs text-neutral-400">Try adjusting your search query or category filter, or make sure products are seeded from your Laravel database.</p>
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
                          {product.category}
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
                          {product.stock !== undefined ? `${product.stock} in stock` : product.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="text-sm font-bold text-white">{product.name}</h3>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">{product.description}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-5 flex items-center justify-between border-t border-neutral-800/60 mt-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold tracking-wider mb-1">Price</span>
                      <span
                        className="text-xl font-bold text-white tracking-tight block leading-none"
                        style={{ fontFamily: FONT_STACK, fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatPeso(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{ fontFamily: 'inherit' }}
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
                        <p
                          className="text-[11px] text-purple-400 font-semibold mt-0.5"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {formatPeso(item.totalPrice)}
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
                    <span
                      className="text-lg font-bold text-white"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatPeso(calculateSubtotal())}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.visit('/checkout');
                    }}
                    style={{ fontFamily: 'inherit' }}
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