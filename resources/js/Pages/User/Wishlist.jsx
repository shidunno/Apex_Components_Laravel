import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, CheckCircle } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addedIds, setAddedIds] = useState([]);

  // Fetch user-specific wishlist from the backend database on load
  useEffect(() => {
    fetch('/wishlist-items', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .then(data => setWishlistItems(data || []))
      .catch(error => console.error("Could not fetch wishlist from server", error));
  }, []);

  const removeItem = (productId) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    fetch(`/wishlist-items/${productId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken
      }
    })
      .then(() => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
      })
      .catch(error => console.error("Could not remove item from wishlist", error));
  };

  const addToCart = (item) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Fetch current cart, append item, and save back to backend /cart
    fetch('/cart', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(res => res.json())
      .then(currentCart => {
        const cartItem = {
          id: Date.now() + Math.random(),
          date: new Date().toLocaleDateString(),
          parts: { [item.categoryKey || 'component']: item },
          totalPrice: Number(item.price),
          name: item.name,
          image: item.image,
          isSinglePart: true
        };

        const updatedCart = [...(currentCart || []), cartItem];

        return fetch('/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({ items: updatedCart })
        });
      })
      .then(() => {
        setAddedIds(prev => [...prev, item.id]);
        setTimeout(() => {
          setAddedIds(prev => prev.filter(id => id !== item.id));
        }, 2000);
      })
      .catch(error => console.error("Could not add wishlist item to cart", error));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-6xl mx-auto w-full p-6 md:p-10 pt-8 space-y-8">
        
        {/* Page Title & Stats Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">My Wishlist</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Saved components ready for your next custom build.</p>
          </div>
          
          <div className="bg-[#161619] px-4 py-2 rounded-2xl border border-neutral-800 flex items-center space-x-3 w-fit shadow-inner">
            <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
            <div>
              <span className="text-sm font-bold text-white">{wishlistItems.length}</span>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">Saved Items</span>
            </div>
          </div>
        </div>

        {/* Wishlist Body */}
        {wishlistItems.length === 0 ? (
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
            <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
            <h2 className="text-lg font-bold text-white">Your wishlist is empty</h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">Explore parts on your dashboard and click the heart icon to save components for later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const isJustAdded = addedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between gap-6 hover:border-purple-500/40 transition-all shadow-lg relative group"
                >
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    title="Remove from wishlist"
                    className="absolute top-4 right-4 p-2 bg-[#0f0f12] text-neutral-400 hover:text-rose-400 rounded-xl border border-neutral-800 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Item Meta */}
                  <div className="space-y-2 pr-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      {item.category || 'Hardware'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.stock !== 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {item.stock !== 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Price</span>
                      <span className="text-lg font-bold text-white">${Number(item.price).toFixed(2)}</span>
                    </div>

                    <button
                      disabled={item.stock === 0}
                      onClick={() => addToCart(item)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                          : item.stock !== 0
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-purple-900/30'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
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

    </div>
  );
}