import { useState } from 'react';
import { Cpu, HardDrive, Zap, ShoppingCart, CheckCircle, RefreshCw, Layers, AlertTriangle, ShieldCheck, Sliders, Plus } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const componentOptions = {
  cpu: [
    { id: 'cpu-1', name: 'Core Ultra 9 285K Processor', price: 589.00, power: 125, socket: 'LGA 1851', category: 'CPU', badge: '24 Cores / 5.7GHz' },
    { id: 'cpu-2', name: 'AMD Ryzen 9 9950X', price: 649.00, power: 170, socket: 'AM5', category: 'CPU', badge: '16 Cores / 5.7GHz' },
    { id: 'cpu-3', name: 'Core Ultra 7 265K', price: 399.00, power: 125, socket: 'LGA 1851', category: 'CPU', badge: '20 Cores / 5.5GHz' }
  ],
  motherboard: [
    { id: 'mb-1', name: 'Cyberpunk Motherboard Z890', price: 399.00, power: 35, socket: 'LGA 1851', memoryType: 'DDR5', category: 'Motherboard', badge: 'LGA 1851 • DDR5' },
    { id: 'mb-2', name: 'ROG Maximus X870 Hero', price: 499.00, power: 40, socket: 'AM5', memoryType: 'DDR5', category: 'Motherboard', badge: 'AM5 • Wi-Fi 7' },
    { id: 'mb-3', name: 'TUF Gaming B850-PLUS', price: 219.00, power: 30, socket: 'AM5', memoryType: 'DDR5', category: 'Motherboard', badge: 'AM5 • PCIe 5.0' }
  ],
  gpu: [
    { id: 'gpu-1', name: 'Apex Titan RTX 5090 OC', price: 1999.00, power: 450, category: 'GPU', badge: '32GB GDDR7 • Triple Fan' },
    { id: 'gpu-2', name: 'Apex GeForce RTX 5080', price: 1199.00, power: 320, category: 'GPU', badge: '16GB GDDR7 • RGB Shroud' },
    { id: 'gpu-3', name: 'Radeon RX 9900 XTX', price: 999.00, power: 350, category: 'GPU', badge: '24GB GDDR6 • Vapor Chamber' }
  ],
  ram: [
    { id: 'ram-1', name: 'Dominator Titanium 64GB DDR5', price: 249.00, power: 15, memoryType: 'DDR5', category: 'RAM', badge: '6000MHz CL30 RGB' },
    { id: 'ram-2', name: 'Vengeance RGB 32GB DDR5', price: 129.00, power: 12, memoryType: 'DDR5', category: 'RAM', badge: '5600MHz CL36' }
  ],
  cooling: [
    { id: 'cool-1', name: 'HydroShift Liquid Cooler 360', price: 219.00, power: 20, category: 'Cooling', badge: '360mm ARGB Radiator' },
    { id: 'cool-2', name: 'Kraken Elite 280 RGB AIO', price: 249.00, power: 22, category: 'Cooling', badge: 'LCD Pump Display' }
  ],
  case: [
    { id: 'case-1', name: 'O11 Dynamic EVO XL Tower', price: 239.00, power: 10, category: 'Case', badge: 'Dual Chamber Tempered Glass' },
    { id: 'case-2', name: 'Corsair 5000D Airflow', price: 174.00, power: 10, category: 'Case', badge: 'High-Airflow Mid-Tower' }
  ]
};

export default function Builder() {
  // Initialize with an empty object so no parts are selected by default
  const [selectedParts, setSelectedParts] = useState({});
  const [activeTab, setActiveTab] = useState('cpu');

  const handleSelectPart = (category, part) => {
    setSelectedParts(prev => ({ ...prev, [category]: part }));
  };

  const handleReset = () => {
    setSelectedParts({});
  };

  // Compatibility Calculations (safely check if both CPU and Motherboard are picked)
  const isCpuMbCompatible = 
    selectedParts.cpu && selectedParts.motherboard 
      ? selectedParts.cpu.socket === selectedParts.motherboard.socket 
      : true;

  const totalPrice = Object.values(selectedParts).reduce((acc, part) => acc + (part ? part.price : 0), 0);
  const totalPower = Object.values(selectedParts).reduce((acc, part) => acc + (part ? part.power : 0), 0);
  const recommendedPSU = totalPower > 0 ? Math.ceil((totalPower * 1.3) / 50) * 50 : 0;

  const handleAddBuildToCart = () => {
    if (Object.keys(selectedParts).length === 0) return;

    const cpuName = selectedParts.cpu ? selectedParts.cpu.name : 'Custom CPU';
    const gpuName = selectedParts.gpu ? selectedParts.gpu.name : 'Custom GPU';
    const buildName = `Custom Rig: ${cpuName} + ${gpuName}`;

    const cartItem = {
      id: 'CUSTOM-RIG-' + Date.now(),
      name: buildName,
      price: totalPrice,
      totalPrice: totalPrice,
      quantity: 1,
      category: 'Custom PC Build',
      parts: selectedParts
    };

    const existingCart = JSON.parse(localStorage.getItem('pc_cart') || '[]');
    localStorage.setItem('pc_cart', JSON.stringify([...existingCart, cartItem]));

    alert(`Successfully added custom build to cart! Total: $${totalPrice.toFixed(2)}`);
  };

  const tabs = [
    { id: 'cpu', label: 'Processor (CPU)' },
    { id: 'motherboard', label: 'Motherboard' },
    { id: 'gpu', label: 'Graphics Card (GPU)' },
    { id: 'ram', label: 'Memory (RAM)' },
    { id: 'cooling', label: 'CPU Cooling' },
    { id: 'case', label: 'Chassis / Case' }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-7xl mx-auto w-full p-6 md:p-10 pt-8 space-y-8">
        
        {/* Page Title & Reset Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">PCPart Picker & Compatibility Engine</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Streamlined component checker with real-time socket verification.</p>
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-[#161619] hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 transition-all flex items-center space-x-2 cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span>Reset Build</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* REAL-TIME COMPATIBILITY NOTIFICATION BANNER (Only shows if both CPU and Motherboard are selected) */}
            {selectedParts.cpu && selectedParts.motherboard && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
                isCpuMbCompatible 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  {isCpuMbCompatible ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {isCpuMbCompatible ? 'System Compatibility Verified' : 'Compatibility Conflict Detected'}
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      {isCpuMbCompatible 
                        ? `CPU socket (${selectedParts.cpu.socket}) matches Motherboard socket successfully.` 
                        : `Warning: CPU socket (${selectedParts.cpu.socket}) does not match Motherboard socket (${selectedParts.motherboard.socket}).`}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                  isCpuMbCompatible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {isCpuMbCompatible ? 'PASSED' : 'ERROR'}
                </span>
              </div>
            )}

            {/* Selection Tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
              {tabs.map((tab) => {
                const isChosen = Boolean(selectedParts[tab.id]);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : isChosen 
                        ? 'bg-[#161619] text-emerald-400 border border-emerald-500/30' 
                        : 'bg-[#161619] text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {isChosen && <CheckCircle className="w-3.5 h-3.5" />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Component Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentOptions[activeTab]?.map((part) => {
                const isSelected = selectedParts[activeTab]?.id === part.id;
                return (
                  <div
                    key={part.id}
                    onClick={() => handleSelectPart(activeTab, part)}
                    className={`bg-[#161619] border rounded-2xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all shadow-md ${
                      isSelected 
                        ? 'border-purple-500 ring-1 ring-purple-500/50 bg-gradient-to-br from-[#161619] to-purple-950/20' 
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                          {part.category}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-purple-400" />}
                      </div>
                      <h4 className="text-sm font-bold text-white pt-1">{part.name}</h4>
                      <p className="text-[11px] text-neutral-400">{part.badge}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-xs text-neutral-300 font-semibold">{part.power}W</span>
                      <span className="text-base font-bold text-white">${part.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-neutral-800">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Build Specification</span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {Object.keys(selectedParts).length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs space-y-2">
                    <Plus className="w-6 h-6 mx-auto opacity-40" />
                    <p>No components selected yet.<br/>Pick parts from the tabs to build your PC.</p>
                  </div>
                ) : (
                  Object.entries(selectedParts).map(([key, part]) => (
                    <div key={key} className="bg-[#0f0f12] p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">{key}</span>
                        <span className="text-xs font-bold text-white line-clamp-1">{part.name}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-300">${part.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              {Object.keys(selectedParts).length > 0 && (
                <div className="bg-[#0f0f12] p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">System Power:</span>
                    <span className="font-bold text-white">{totalPower}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recommended PSU:</span>
                    <span className="font-bold text-purple-400">{recommendedPSU}W Gold</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-400">Total Price:</span>
                  <span className="text-xl font-black text-white">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  disabled={Object.keys(selectedParts).length === 0}
                  onClick={handleAddBuildToCart}
                  className={`w-full py-3.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 ${
                    Object.keys(selectedParts).length === 0 
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-purple-900/45 cursor-pointer'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Build to Cart</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}