<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing products to prevent duplicate slugs on re-seeding
        Product::truncate();

        $products = [
            // ==================== 1. PROCESSORS (CPU) ====================
            [
                'name' => 'AMD Ryzen 5 5600X',
                'description' => '6 Cores, 12 Threads, AM4 Socket, up to 4.6GHz Boost',
                'price' => 11500.00,
                'stock' => 25,
                'category' => 'cpu',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'AMD Ryzen 7 7800X3D',
                'description' => '8 Cores, 16 Threads, AM5 Socket, Ultimate Gaming Processor',
                'price' => 24500.00,
                'stock' => 15,
                'category' => 'cpu',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Intel Core i5-13400F',
                'description' => '10 Cores (6 P-Cores + 4 E-Cores), LGA1700 Socket',
                'price' => 12800.00,
                'stock' => 20,
                'category' => 'cpu',
                'image' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Intel Core i7-14700K',
                'description' => '20 Cores, 28 Threads, LGA1700 Socket, up to 5.6GHz',
                'price' => 23900.00,
                'stock' => 10,
                'category' => 'cpu',
                'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'AMD Ryzen 5 7600',
                'description' => '6 Cores, 12 Threads, AM5 Socket, Zen 4 Architecture',
                'price' => 12900.00,
                'stock' => 30,
                'category' => 'cpu',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 2. MOTHERBOARDS ====================
            [
                'name' => 'MSI B450 TOMAHAWK MAX II',
                'description' => 'AM4 Socket, ATX, DDR4 Motherboard with robust power design',
                'price' => 6200.00,
                'stock' => 18,
                'category' => 'motherboard',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Gigabyte B650 AORUS ELITE AX',
                'description' => 'AM5 Socket, ATX, DDR5, Wi-Fi 6E Motherboard',
                'price' => 13500.00,
                'stock' => 12,
                'category' => 'motherboard',
                'image' => 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'ASUS TUF GAMING B760M-PLUS WIFI',
                'description' => 'LGA1700 Socket, Micro-ATX, DDR5 Motherboard',
                'price' => 10900.00,
                'stock' => 14,
                'category' => 'motherboard',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'MSI MAG Z790 TOMAHAWK WIFI',
                'description' => 'LGA1700 Socket, ATX, DDR5 High-End Motherboard',
                'price' => 17200.00,
                'stock' => 8,
                'category' => 'motherboard',
                'image' => 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'ASRock A620M-HDV/M.2',
                'description' => 'AM5 Socket, Micro-ATX, DDR5 Budget Motherboard',
                'price' => 5800.00,
                'stock' => 22,
                'category' => 'motherboard',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 3. GRAPHICS CARDS (GPU) ====================
            [
                'name' => 'NVIDIA GeForce RTX 4060 8GB',
                'description' => 'DLSS 3, Ray Tracing, 8GB GDDR6, Great 1080p/1440p card',
                'price' => 18500.00,
                'stock' => 15,
                'category' => 'gpu',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'NVIDIA GeForce RTX 4070 Super 12GB',
                'description' => 'High performance 1440p gaming and content creation card',
                'price' => 37900.00,
                'stock' => 10,
                'category' => 'gpu',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'AMD Radeon RX 7800 XT 16GB',
                'description' => '16GB VRAM, Exceptional 1440p performance and value',
                'price' => 31500.00,
                'stock' => 12,
                'category' => 'gpu',
                'image' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'NVIDIA GeForce RTX 4090 24GB',
                'description' => 'The ultimate flagship graphics card for 4K gaming',
                'price' => 105000.00,
                'stock' => 3,
                'category' => 'gpu',
                'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'AMD Radeon RX 7600 8GB',
                'description' => 'Entry-to-mid range 1080p gaming graphics card',
                'price' => 15800.00,
                'stock' => 20,
                'category' => 'gpu',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 4. MEMORY (RAM) ====================
            [
                'name' => 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz',
                'description' => 'High-performance DDR4 desktop memory kit',
                'price' => 2600.00,
                'stock' => 40,
                'category' => 'ram',
                'image' => 'https://images.unsplash.com/photo-1562976540-1e02c414c1c9?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Kingston Fury Beast 32GB (2x16GB) DDR5 5600MHz',
                'description' => 'Next-gen DDR5 high capacity gaming memory',
                'price' => 6500.00,
                'stock' => 25,
                'category' => 'ram',
                'image' => 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz',
                'description' => 'High speed RGB DDR5 memory optimized for performance',
                'price' => 7800.00,
                'stock' => 18,
                'category' => 'ram',
                'image' => 'https://images.unsplash.com/photo-1562976540-1e02c414c1c9?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'TeamGroup T-Force Vulcan Z 16GB (2x8GB) DDR4 3600MHz',
                'description' => 'Affordable and fast DDR4 memory kit',
                'price' => 2800.00,
                'stock' => 30,
                'category' => 'ram',
                'image' => 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5 5600MHz',
                'description' => 'Elite performance memory for heavy workloads and workstations',
                'price' => 14500.00,
                'stock' => 7,
                'category' => 'ram',
                'image' => 'https://images.unsplash.com/photo-1562976540-1e02c414c1c9?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 5. COOLING ====================
            [
                'name' => 'DeepCool AK400 Digital CPU Air Cooler',
                'description' => 'Single-tower air cooler with status display screen',
                'price' => 1900.00,
                'stock' => 25,
                'category' => 'cooling',
                'image' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Thermalright Peerless Assassin 120 SE',
                'description' => 'Dual-tower CPU cooler offering top-tier air cooling performance',
                'price' => 2400.00,
                'stock' => 30,
                'category' => 'cooling',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'NZXT Kraken 240 RGB Liquid Cooler',
                'description' => 'All-in-one liquid CPU cooler with customizable display',
                'price' => 7900.00,
                'stock' => 12,
                'category' => 'cooling',
                'image' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Corsair iCUE H150i Elite Capellix XT 360mm',
                'description' => 'High performance 360mm AIO liquid cooler',
                'price' => 11200.00,
                'stock' => 9,
                'category' => 'cooling',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Cooler Master Hyper 212 Halo',
                'description' => 'Classic air cooler with updated halo ARGB lighting',
                'price' => 1800.00,
                'stock' => 20,
                'category' => 'cooling',
                'image' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 6. CHASSIS / CASE ====================
            [
                'name' => 'NZXT H5 Flow ATX Mid Tower',
                'description' => 'High airflow mid-tower case with perforated front panel',
                'price' => 4900.00,
                'stock' => 16,
                'category' => 'case',
                'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Corsair 4000D Airflow Tempered Glass',
                'description' => 'Optimized high-airflow ATX mid-tower case',
                'price' => 4700.00,
                'stock' => 20,
                'category' => 'case',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Lian Li O11 Dynamic EVO',
                'description' => 'Exceptional dual-chamber showcase chassis with modular design',
                'price' => 9200.00,
                'stock' => 10,
                'category' => 'case',
                'image' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Phanteks Eclipse G360A',
                'description' => 'High airflow mesh ATX chassis with three included ARGB fans',
                'price' => 4200.00,
                'stock' => 15,
                'category' => 'case',
                'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Cooler Master MasterBox Q300L',
                'description' => 'Compact Micro-ATX tower with flexible I/O panel',
                'price' => 2900.00,
                'stock' => 22,
                'category' => 'case',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],

            // ==================== 7. PRE-BUILT RIGS ====================
            [
                'name' => 'Apex Essential Gaming Rig (Ryzen 5 + RTX 4060)',
                'description' => 'Pre-built system featuring Ryzen 5 5600X, RTX 4060, 16GB RAM, 1TB NVMe SSD',
                'price' => 45000.00,
                'stock' => 5,
                'category' => 'prebuilt',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Apex Pro Elite Beast (Ryzen 7 + RTX 4070 Super)',
                'description' => 'High performance pre-built setup for 1440p ultra gaming and rendering',
                'price' => 78000.00,
                'stock' => 4,
                'category' => 'prebuilt',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Apex Ultimate 4K Master (i7-14700K + RTX 4090)',
                'description' => 'Maximum performance powerhouse built with top-of-the-line components',
                'price' => 165000.00,
                'stock' => 2,
                'category' => 'prebuilt',
                'image' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Apex Cyber Compact Rig (Ryzen 5 7600 + RX 7600)',
                'description' => 'Streamlined and budget-friendly DDR5 gaming desktop',
                'price' => 41000.00,
                'stock' => 6,
                'category' => 'prebuilt',
                'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
            ],
            [
                'name' => 'Apex Creator Studio Workstation (i7-14700K + 64GB RAM)',
                'description' => 'Optimized video editing and 3D modeling workstation rig',
                'price' => 95000.00,
                'stock' => 3,
                'category' => 'prebuilt',
                'image' => 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80',
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']) . '-' . rand(1000, 9999),
                'description' => $product['description'],
                'price' => $product['price'],
                'stock' => $product['stock'],
                'category' => $product['category'],
                'image' => $product['image'],
            ]);
        }
    }
}