import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
  ShoppingCart, CheckCircle, RefreshCw, Layers, AlertTriangle, ShieldCheck,
  Sliders, Plus, XCircle, HelpCircle, Check, X, EyeOff
} from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// Philippine Peso currency formatter
const formatPeso = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

/* -------------------------------------------------------------------------- */
/*  SPEC NORMALISATION                                                         */
/*  Explicit DB columns always win. If a column is missing we infer the spec   */
/*  from the product name. If we can't infer it, the spec stays `null` and the */
/*  checker reports "can't verify" instead of silently passing.                */
/* -------------------------------------------------------------------------- */

const DEFAULT_POWER = { cpu: 105, motherboard: 60, gpu: 220, ram: 10, cooling: 15, case: 0 };
const BASE_SYSTEM_POWER = 30; // storage, fans, USB, etc.

const FORM_RANK = { ITX: 1, MATX: 2, ATX: 3, EATX: 4 };
const FORM_LABEL = { ITX: 'Mini-ITX', MATX: 'Micro-ATX', ATX: 'ATX', EATX: 'E-ATX' };

// Sockets whose cooler mounting hardware is interchangeable
const MOUNT_GROUPS = [['AM4', 'AM5'], ['LGA1700', 'LGA1851'], ['LGA1200', 'LGA1151']];

const up = (s) => String(s || '').toUpperCase();
const pick = (obj, ...keys) => {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  return null;
};
const toNum = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
const socketTokens = (value) =>
  up(Array.isArray(value) ? value.join(',') : value)
    .replace(/LGA[\s-]*/g, 'LGA')
    .split(/[,/|]/)
    .map((t) => t.replace(/[\s-]/g, '').trim())
    .filter(Boolean);

const inferCpuSocket = (name) => {
  const n = up(name);
  const ryzen = n.match(/RYZEN\s*(?:AI\s*)?[3579]\s*(?:PRO\s*)?(\d)\d{3}/);
  if (ryzen) return Number(ryzen[1]) >= 7 ? 'AM5' : 'AM4';
  if (/CORE\s*ULTRA/.test(n)) return 'LGA1851';
  const intel = n.match(/I[3579][-\s]?(\d{1,2})\d{3}/);
  if (intel) {
    const gen = Number(intel[1]);
    if (gen >= 12) return 'LGA1700';
    if (gen >= 10) return 'LGA1200';
    if (gen >= 6) return 'LGA1151';
  }
  return null;
};

const BOARD_SOCKETS = [
  ['AM5', /(?<![A-Z0-9])(A620|B650|X670|B840|B850|X870)/],
  ['AM4', /(?<![A-Z0-9])(A320|B350|X370|B450|X470|A520|B550|X570)/],
  ['LGA1851', /(?<![A-Z0-9])(Z890|B860|H810|W880)/],
  ['LGA1700', /(?<![A-Z0-9])(H610|B660|H670|Z690|B760|H770|Z790)/],
  ['LGA1200', /(?<![A-Z0-9])(H410|B460|H470|Z490|H510|B560|H570|Z590)/],
  ['LGA1151', /(?<![A-Z0-9])(H310|B360|B365|H370|Z370|Z390)/],
];
const inferBoardSocket = (name) => {
  const n = up(name);
  const direct = n.match(/\b(AM[45]|LGA\s?-?(?:1851|1700|1200|1151))\b/);
  if (direct) return socketTokens(direct[1])[0];
  const hit = BOARD_SOCKETS.find(([, re]) => re.test(n));
  return hit ? hit[0] : null;
};

const inferBoardMemory = (name, socket) => {
  const n = up(name);
  const m = n.match(/DDR\s?([45])/);
  if (m) return `DDR${m[1]}`;
  if (/\bD4\b/.test(n)) return 'DDR4';
  if (/\bD5\b/.test(n)) return 'DDR5';
  if (socket === 'AM5' || socket === 'LGA1851') return 'DDR5';
  if (socket === 'AM4' || socket === 'LGA1200' || socket === 'LGA1151') return 'DDR4';
  return null; 
};

const inferBoardForm = (name, hasChipset) => {
  const n = up(name);
  if (/E-?ATX|EATX/.test(n)) return 'EATX';
  if (/MICRO[\s-]?ATX|M-?ATX/.test(n)) return 'MATX';
  if (/MINI[\s-]?ITX|\bITX\b/.test(n)) return 'ITX';
  if (/(?<![A-Z0-9])[ABXZHW]\d{2,3}E?M(?![A-Z0-9])/.test(n)) return 'MATX'; 
  if (/(?<![A-Z0-9])[ABXZHW]\d{2,3}E?I(?![A-Z0-9])/.test(n)) return 'ITX'; 
  if (/\bATX\b/.test(n) || hasChipset) return 'ATX';
  return null;
};

const normForm = (v) => {
  const s = up(v).replace(/[\s_-]/g, '');
  if (/EATX/.test(s)) return 'EATX';
  if (/MICROATX|MATX/.test(s)) return 'MATX';
  if (/MINIITX|ITX/.test(s)) return 'ITX';
  if (/ATX/.test(s)) return 'ATX';
  return null;
};

const inferCaseForms = (name) => {
  const n = up(name);
  if (/FULL[\s-]?TOWER|E-?ATX/.test(n)) return ['EATX', 'ATX', 'MATX', 'ITX'];
  if (/MICRO[\s-]?ATX|M-?ATX|MINI[\s-]?TOWER/.test(n)) return ['MATX', 'ITX'];
  if (/ITX/.test(n) && !/ATX/.test(n.replace('ITX', ''))) return ['ITX'];
  if (/MID[\s-]?TOWER|\bATX\b/.test(n)) return ['ATX', 'MATX', 'ITX'];
  return null;
};

const buildPart = (product, cat) => {
  const name = product.name || '';
  const specs = {};

  if (cat === 'cpu') {
    const s = pick(product, 'socket');
    specs.socket = s ? socketTokens(s)[0] : inferCpuSocket(name);
  }

  if (cat === 'motherboard') {
    const s = pick(product, 'socket');
    specs.socket = s ? socketTokens(s)[0] : inferBoardSocket(name);
    const mem = pick(product, 'memoryType', 'memory_type');
    specs.memoryType = mem ? up(mem).replace(/\s/g, '') : inferBoardMemory(name, specs.socket);
    const ff = pick(product, 'formFactor', 'form_factor');
    specs.formFactor = ff ? normForm(ff) : inferBoardForm(name, Boolean(specs.socket));
  }

  if (cat === 'ram') {
    const mem = pick(product, 'memoryType', 'memory_type');
    const m = up(`${mem || ''} ${name} ${product.type || ''}`).match(/DDR\s?([45])/);
    specs.memoryType = m ? `DDR${m[1]}` : null;
  }

  if (cat === 'cooling') {
    const explicit = pick(product, 'coolerSockets', 'cooler_sockets', 'supportedSockets', 'supported_sockets');
    specs.coolerSockets = explicit
      ? socketTokens(explicit)
      : [...new Set(up(name).replace(/LGA[\s-]*/g, 'LGA').match(/AM[45]|LGA\d{3,4}/g) || [])];
    specs.height = toNum(pick(product, 'height', 'coolerHeight', 'cooler_height'));
    specs.isLiquid = /AIO|LIQUID|WATER/.test(up(`${name} ${product.type || ''}`));
  }

  if (cat === 'gpu') {
    specs.length = toNum(pick(product, 'length', 'gpuLength', 'gpu_length', 'card_length'));
  }

  if (cat === 'case') {
    const ff = pick(product, 'formFactors', 'form_factors', 'formFactor', 'form_factor');
    if (ff) {
      const list = (Array.isArray(ff) ? ff : String(ff).split(/[,/|]/)).map(normForm).filter(Boolean);
      specs.formFactors = list.length ? list : null;
    } else {
      specs.formFactors = inferCaseForms(`${name} ${product.type || ''}`);
    }
    specs.maxGpuLength = toNum(pick(product, 'maxGpuLength', 'max_gpu_length'));
    specs.maxCoolerHeight = toNum(pick(product, 'maxCoolerHeight', 'max_cooler_height'));
  }

  return {
    id: product.id,
    name,
    price: Number(product.price) || 0,
    power: Number(product.power) || DEFAULT_POWER[cat] || 0,
    category: product.type || cat.toUpperCase(),
    badge: product.badge || 'In Stock',
    cat,
    specs,
  };
};

const specChips = (part) => {
  const s = part.specs;
  const chips = [];
  if (s.socket) chips.push(s.socket);
  if (s.memoryType) chips.push(s.memoryType);
  if (s.formFactor) chips.push(FORM_LABEL[s.formFactor]);
  if (s.coolerSockets?.length) chips.push(s.coolerSockets.join(' / '));
  if (s.height) chips.push(`${s.height}mm tall`);
  if (s.length) chips.push(`${s.length}mm long`);
  if (s.formFactors?.length) chips.push(`Fits ${FORM_LABEL[s.formFactors.reduce((a, b) => (FORM_RANK[a] > FORM_RANK[b] ? a : b))]} and smaller`);
  if (s.maxGpuLength) chips.push(`GPU ≤ ${s.maxGpuLength}mm`);
  if (s.maxCoolerHeight) chips.push(`Cooler ≤ ${s.maxCoolerHeight}mm`);
  return chips;
};

/* -------------------------------------------------------------------------- */
/*  COMPATIBILITY ENGINE                                                       */
/* -------------------------------------------------------------------------- */

const expandMounts = (sockets) => {
  const out = new Set(sockets);
  MOUNT_GROUPS.forEach((g) => { if (g.some((s) => out.has(s))) g.forEach((s) => out.add(s)); });
  return out;
};

const evaluateBuild = (parts) => {
  const { cpu, motherboard: mb, gpu, ram, cooling, case: pcCase } = parts;
  const checks = [];
  const add = (id, between, label, status, message) => checks.push({ id, between, label, status, message });

  if (cpu && mb) {
    const a = cpu.specs.socket, b = mb.specs.socket;
    if (!a || !b) add('cpu-socket', ['cpu', 'motherboard'], 'CPU ↔ Motherboard socket', 'unknown',
      `Socket unknown for ${!a ? 'the CPU' : 'the motherboard'}. Check the spec sheet.`);
    else if (a === b) add('cpu-socket', ['cpu', 'motherboard'], 'CPU ↔ Motherboard socket', 'pass', `Both use ${a}.`);
    else add('cpu-socket', ['cpu', 'motherboard'], 'CPU ↔ Motherboard socket', 'fail',
      `The CPU is ${a} but the motherboard is ${b}. They will not physically fit.`);
  }

  if (mb && ram) {
    const a = mb.specs.memoryType, b = ram.specs.memoryType;
    if (!a || !b) add('ram-type', ['motherboard', 'ram'], 'Motherboard ↔ RAM type', 'unknown',
      `Memory type unknown for ${!a ? 'the motherboard' : 'the RAM'}. Check the spec sheet.`);
    else if (a === b) add('ram-type', ['motherboard', 'ram'], 'Motherboard ↔ RAM type', 'pass', `Both use ${a}.`);
    else add('ram-type', ['motherboard', 'ram'], 'Motherboard ↔ RAM type', 'fail',
      `The motherboard takes ${a} but this RAM is ${b}. The slots are keyed differently.`);
  }

  if (mb && pcCase) {
    const board = mb.specs.formFactor, supported = pcCase.specs.formFactors;
    if (!board || !supported) add('board-case', ['motherboard', 'case'], 'Motherboard ↔ Case size', 'unknown',
      `Form factor unknown for ${!board ? 'the motherboard' : 'the case'}. Check the spec sheet.`);
    else if (supported.some((f) => f === board) || supported.some((f) => FORM_RANK[f] >= FORM_RANK[board])) {
      add('board-case', ['motherboard', 'case'], 'Motherboard ↔ Case size', 'pass', `${FORM_LABEL[board]} board fits this case.`);
    } else {
      add('board-case', ['motherboard', 'case'], 'Motherboard ↔ Case size', 'fail',
        `A ${FORM_LABEL[board]} board will not fit. This case supports up to ${FORM_LABEL[supported.reduce((a, b) => (FORM_RANK[a] > FORM_RANK[b] ? a : b))]}.`);
    }
  }

  if (cpu && cooling) {
    const cpuSocket = cpu.specs.socket, list = cooling.specs.coolerSockets;
    if (!cpuSocket || !list?.length) add('cooler-socket', ['cpu', 'cooling'], 'CPU ↔ Cooler mount', 'unknown',
      `Can't confirm mounting support for ${!cpuSocket ? 'this CPU socket' : 'this cooler'}. Check the cooler's supported sockets.`);
    else if (expandMounts(list).has(cpuSocket)) add('cooler-socket', ['cpu', 'cooling'], 'CPU ↔ Cooler mount', 'pass',
      `Cooler supports ${cpuSocket}.`);
    else add('cooler-socket', ['cpu', 'cooling'], 'CPU ↔ Cooler mount', 'fail',
      `This cooler supports ${list.join(', ')} but the CPU is ${cpuSocket}.`);
  }

  if (gpu && pcCase && gpu.specs.length && pcCase.specs.maxGpuLength) {
    const ok = gpu.specs.length <= pcCase.specs.maxGpuLength;
    add('gpu-clearance', ['gpu', 'case'], 'GPU ↔ Case clearance', ok ? 'pass' : 'fail',
      ok ? `${gpu.specs.length}mm card fits within ${pcCase.specs.maxGpuLength}mm.`
         : `The GPU is ${gpu.specs.length}mm but the case allows ${pcCase.specs.maxGpuLength}mm.`);
  }

  if (cooling && pcCase && !cooling.specs.isLiquid && cooling.specs.height && pcCase.specs.maxCoolerHeight) {
    const ok = cooling.specs.height <= pcCase.specs.maxCoolerHeight;
    add('cooler-clearance', ['cooling', 'case'], 'Cooler ↔ Case clearance', ok ? 'pass' : 'fail',
      ok ? `${cooling.specs.height}mm cooler fits within ${pcCase.specs.maxCoolerHeight}mm.`
         : `The cooler is ${cooling.specs.height}mm but the case allows ${pcCase.specs.maxCoolerHeight}mm.`);
  }

  return checks;
};

const assessCandidate = (cat, part, selected) => {
  const related = evaluateBuild({ ...selected, [cat]: part }).filter((c) => c.between.includes(cat));
  const fail = related.find((c) => c.status === 'fail');
  if (fail) return { state: 'incompatible', message: fail.message };
  if (related.some((c) => c.status === 'unknown')) return { state: 'unverified', message: related.find((c) => c.status === 'unknown').message };
  if (related.length) return { state: 'compatible', message: 'Compatible with your current selection.' };
  return { state: 'neutral' };
};

const STATUS_UI = {
  pass: { Icon: Check, text: 'text-emerald-400', row: 'border-emerald-500/20 bg-emerald-500/5' },
  fail: { Icon: XCircle, text: 'text-rose-400', row: 'border-rose-500/40 bg-rose-500/10' },
  unknown: { Icon: HelpCircle, text: 'text-amber-400', row: 'border-amber-500/30 bg-amber-500/5' },
};

const TABS = [
  { id: 'cpu', label: 'Processor (CPU)' },
  { id: 'motherboard', label: 'Motherboard' },
  { id: 'gpu', label: 'Graphics Card (GPU)' },
  { id: 'ram', label: 'Memory (RAM)' },
  { id: 'cooling', label: 'CPU Cooling' },
  { id: 'case', label: 'Chassis / Case' },
];

/* -------------------------------------------------------------------------- */

export default function Builder({ products = [] }) {
  const [componentOptions, setComponentOptions] = useState({
    cpu: [], motherboard: [], gpu: [], ram: [], cooling: [], case: [],
  });
  const [selectedParts, setSelectedParts] = useState({});
  const [activeTab, setActiveTab] = useState('cpu');
  const [hideIncompatible, setHideIncompatible] = useState(false);
  const [cartModal, setCartModal] = useState(null); 

  useEffect(() => {
    if (!cartModal) return;
    const onKey = (e) => e.key === 'Escape' && setCartModal(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartModal]);

  useEffect(() => {
    const availableProducts = products.length > 0
      ? products
      : JSON.parse(localStorage.getItem('apex_catalog_products') || '[]');

    const grouped = { cpu: [], motherboard: [], gpu: [], ram: [], cooling: [], case: [] };

    availableProducts.forEach((product) => {
      const cat = product.builder_category || (product.category ? product.category.toLowerCase().trim() : '');
      if (grouped[cat]) grouped[cat].push(buildPart(product, cat));
    });

    setComponentOptions(grouped);
  }, [products]);

  const handleSelectPart = (category, part) => {
    setSelectedParts((prev) => {
      if (prev[category]?.id === part.id) {
        const { [category]: _removed, ...rest } = prev; 
        return rest;
      }
      return { ...prev, [category]: part };
    });
  };

  const handleRemovePart = (category) => {
    setSelectedParts((prev) => {
      const { [category]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleReset = () => setSelectedParts({});

  const checks = useMemo(() => evaluateBuild(selectedParts), [selectedParts]);
  const failures = checks.filter((c) => c.status === 'fail');
  const unknowns = checks.filter((c) => c.status === 'unknown');
  const conflictCategories = new Set(failures.flatMap((c) => c.between));
  const hasConflict = failures.length > 0;

  const selectedCount = Object.keys(selectedParts).length;
  const missingParts = TABS.filter((t) => !selectedParts[t.id]);

  const totalPrice = Object.values(selectedParts).reduce((acc, part) => acc + (part ? part.price : 0), 0);
  const partsPower = Object.values(selectedParts).reduce((acc, part) => acc + (part ? part.power : 0), 0);
  const totalPower = selectedCount > 0 ? partsPower + BASE_SYSTEM_POWER : 0;
  const recommendedPSU = totalPower > 0 ? Math.ceil((totalPower * 1.3) / 50) * 50 : 0;

  // Updated to sync directly with backend database cart API[cite: 3, 4]
  const handleAddBuildToCart = () => {
    if (selectedCount === 0 || hasConflict) return;

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
      parts: selectedParts,
    };

    fetch('/cart', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .then(existingCart => {
        const currentItems = Array.isArray(existingCart) ? existingCart : [];
        const updatedCart = [...currentItems, cartItem];
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

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
        setCartModal({ name: buildName, total: totalPrice, count: selectedCount });
      })
      .catch(error => console.error("Could not sync custom build to server cart", error));
  };

  const assessed = (componentOptions[activeTab] || []).map((part) => ({
    part,
    assessment: assessCandidate(activeTab, part, selectedParts),
  }));
  const hiddenCount = assessed.filter((a) => a.assessment.state === 'incompatible').length;
  const visibleOptions = hideIncompatible ? assessed.filter((a) => a.assessment.state !== 'incompatible') : assessed;

  const bannerTone = hasConflict
    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
    : unknowns.length
    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
    : checks.length
    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
    : 'bg-[#161619] border-neutral-800 text-neutral-300';

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-7xl mx-auto w-full p-6 md:p-10 pt-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">PCPart Picker & Compatibility Engine</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Every part you pick is checked against the rest of your build in real time.</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#161619] hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 transition-all flex items-center space-x-2 cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span>Reset Build</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

          <div className="lg:col-span-2 space-y-6">

            <div className={`p-4 rounded-2xl border shadow-lg space-y-3 ${bannerTone}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {hasConflict ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : checks.length && !unknowns.length ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 shrink-0 opacity-70" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {hasConflict
                        ? `${failures.length} compatibility ${failures.length === 1 ? 'conflict' : 'conflicts'}`
                        : checks.length
                        ? unknowns.length ? 'No conflicts, some checks unverified' : 'All checks passed'
                        : 'Waiting for parts to check'}
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      {checks.length
                        ? `${checks.filter((c) => c.status === 'pass').length} passed · ${failures.length} failed · ${unknowns.length} unverified`
                        : 'Pick two related parts, such as a CPU and a motherboard, to start checking.'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-current/30 shrink-0">
                  {selectedCount}/6 parts
                </span>
              </div>

              {checks.length > 0 && (
                <ul className="space-y-2">
                  {[...failures, ...unknowns, ...checks.filter((c) => c.status === 'pass')].map((c) => {
                    const { Icon, text, row } = STATUS_UI[c.status];
                    return (
                      <li key={c.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${row}`}>
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${text}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white">{c.label}</p>
                          <p className="text-[11px] text-neutral-300">{c.message}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex overflow-x-auto space-x-2 pb-3 pt-1 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#121215] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-600/55 transition-all">
              {TABS.map((tab) => {
                const isChosen = Boolean(selectedParts[tab.id]);
                const isConflict = conflictCategories.has(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : isConflict
                        ? 'bg-rose-950/30 text-rose-300 border border-rose-500/40'
                        : isChosen
                        ? 'bg-[#161619] text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#161619] text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {isConflict ? <AlertTriangle className="w-3.5 h-3.5" /> : isChosen && <CheckCircle className="w-3.5 h-3.5" />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-neutral-500">
                {hiddenCount > 0
                  ? `${hiddenCount} ${hiddenCount === 1 ? 'part here is' : 'parts here are'} incompatible with your build.`
                  : 'Parts are checked against what you have already picked.'}
              </p>
              <button
                onClick={() => setHideIncompatible((v) => !v)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                  hideIncompatible
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-[#161619] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                Hide incompatible
              </button>
            </div>

            {visibleOptions.length === 0 ? (
              <div className="text-center py-16 bg-[#161619] border border-neutral-800 rounded-2xl space-y-2">
                <Sliders className="w-8 h-8 mx-auto text-neutral-600" />
                <p className="text-xs font-bold text-white">
                  {assessed.length === 0 ? 'No components found for this category' : 'Nothing here fits your current build'}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {assessed.length === 0
                    ? 'Make sure your database table has products seeded with matching categories.'
                    : 'Turn off "Hide incompatible" to see why, or change an earlier pick.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleOptions.map(({ part, assessment }) => {
                  const isSelected = selectedParts[activeTab]?.id === part.id;
                  const bad = assessment.state === 'incompatible';
                  const chips = specChips(part);
                  return (
                    <div
                      key={part.id}
                      onClick={() => handleSelectPart(activeTab, part)}
                      className={`bg-[#161619] border rounded-2xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all shadow-md ${
                        bad
                          ? isSelected
                            ? 'border-rose-500 ring-1 ring-rose-500/50 bg-rose-950/20'
                            : 'border-rose-500/30 opacity-70 hover:opacity-100'
                          : isSelected
                          ? 'border-purple-500 ring-1 ring-purple-500/50 bg-gradient-to-br from-[#161619] to-purple-950/20'
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            {part.category}
                          </span>
                          {isSelected && <CheckCircle className={`w-4 h-4 ${bad ? 'text-rose-400' : 'text-purple-400'}`} />}
                        </div>
                        <h4 className="text-sm font-bold text-white pt-1">{part.name}</h4>
                        <p className="text-[11px] text-neutral-400">{part.badge}</p>

                        {chips.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {chips.map((chip) => (
                              <span key={chip} className="text-[10px] text-neutral-300 bg-[#0f0f12] border border-neutral-800 px-2 py-0.5 rounded-md">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}

                        {assessment.state === 'incompatible' && (
                          <p className="flex items-start gap-1.5 text-[11px] text-rose-300 pt-2">
                            <XCircle className="w-3.5 h-3.5 mt-px shrink-0" />
                            <span>{assessment.message}</span>
                          </p>
                        )}
                        {assessment.state === 'unverified' && (
                          <p className="flex items-start gap-1.5 text-[11px] text-amber-300 pt-2">
                            <HelpCircle className="w-3.5 h-3.5 mt-px shrink-0" />
                            <span>{assessment.message}</span>
                          </p>
                        )}
                        {assessment.state === 'compatible' && (
                          <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-2">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{assessment.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-semibold">{part.power}W</span>
                        <span className="text-base font-bold text-white">{formatPeso(part.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-neutral-800">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Build Specification</span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#121215] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-600/55 transition-all">
                {selectedCount === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs space-y-2">
                    <Plus className="w-6 h-6 mx-auto opacity-40" />
                    <p>No components selected yet.<br />Pick parts from the tabs to build your PC.</p>
                  </div>
                ) : (
                  Object.entries(selectedParts).map(([key, part]) => (
                    <div
                      key={key}
                      className={`bg-[#0f0f12] p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        conflictCategories.has(key) ? 'border-rose-500/40' : 'border-neutral-800/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">{key}</span>
                        <span className="text-xs font-bold text-white line-clamp-1">{part.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-purple-300">{formatPeso(part.price)}</span>
                        <button
                          onClick={() => handleRemovePart(key)}
                          aria-label={`Remove ${key}`}
                          className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedCount > 0 && (
                <div className="bg-[#0f0f12] p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">System Power:</span>
                    <span className="font-bold text-white">{totalPower}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recommended PSU:</span>
                    <span className="font-bold text-purple-400">{recommendedPSU}W Gold</span>
                  </div>
                  {missingParts.length > 0 && (
                    <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
                      Still needed: {missingParts.map((t) => t.label.replace(/ \(.*\)/, '')).join(', ')}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-400">Total Price:</span>
                  <span className="text-xl font-black text-white">{formatPeso(totalPrice)}</span>
                </div>

                {hasConflict && (
                  <p className="text-[11px] text-rose-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0" />
                    Fix the {failures.length} {failures.length === 1 ? 'conflict' : 'conflicts'} above to continue.
                  </p>
                )}

                <button
                  disabled={selectedCount === 0 || hasConflict}
                  onClick={handleAddBuildToCart}
                  className={`w-full py-3.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 ${
                    selectedCount === 0 || hasConflict
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-purple-900/45 cursor-pointer'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{hasConflict ? 'Resolve Conflicts to Continue' : 'Add Build to Cart'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {cartModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setCartModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#161619] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 id="cart-modal-title" className="text-base font-bold text-white">Build added to cart</h3>
                  <p className="text-[11px] text-neutral-400">{cartModal.count} parts, all compatible.</p>
                </div>
              </div>
              <button
                onClick={() => setCartModal(null)}
                aria-label="Close"
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#0f0f12] border border-neutral-800 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-white line-clamp-2">{cartModal.name}</p>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span className="text-xs text-neutral-400">Total</span>
                <span className="text-lg font-black text-white">{formatPeso(cartModal.total)}</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setCartModal(null)}
                className="flex-1 py-3 text-xs font-bold text-neutral-300 bg-[#0f0f12] hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all cursor-pointer"
              >
                Keep Building
              </button>
              <button
                onClick={() => router.visit('/catalog?openCart=1')}
                className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl transition-all shadow-lg shadow-purple-900/45 cursor-pointer"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}