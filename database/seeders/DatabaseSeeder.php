<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Apex Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('qazplm09'),
            'role' => 'admin',
            'avatar' => null,
            'street' => 'San Jose City',
            'city' => 'San Jose City',
            'state' => 'Nueva Ecija',
            'postal_code' => '3121',
            'country' => 'Philippines',
        ]);

        $this->call([
            ProductSeeder::class,
        ]);

        // Regular User / Customer
        User::create([
            'name' => 'Justine Salcedo',
            'email' => 'justinesalcedo2006@gmail.com',
            'password' => Hash::make('qazplm09'),
            'role' => 'customer',
            'avatar' => null,
            'street' => 'San Jose City',
            'city' => 'San Jose City',
            'state' => 'Nueva Ecija',
            'postal_code' => '3121',
            'country' => 'Philippines',
        ]);
    }
}