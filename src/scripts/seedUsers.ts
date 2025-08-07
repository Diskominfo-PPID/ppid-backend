// src/scripts/seedUsers.ts
import dotenv from 'dotenv';
dotenv.config();

import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding default users...');

    // Hash passwords
    const defaultPassword = await bcrypt.hash('ppid2024', 10);

    // 1. PPID Utama
    const { error: ppidError } = await supabase
      .from('ppid')
      .upsert({
        no_pegawai: 'PPID001',
        email: 'ppid.utama@diskominfo.go.id',
        hashed_password: defaultPassword,
        nama: 'PPID Utama'
      }, { onConflict: 'no_pegawai' });

    if (ppidError) console.error('Error seeding PPID Utama:', ppidError);
    else console.log('✅ PPID Utama created');

    // 2. PPID Pelaksana (menggunakan tabel ppid dengan role berbeda)
    // Coba insert tanpa role dulu jika kolom belum ada
    const { error: pelaksanaError } = await supabase
      .from('ppid')
      .upsert({
        no_pegawai: 'PPID002',
        email: 'ppid.pelaksana@diskominfo.go.id',
        hashed_password: defaultPassword,
        nama: 'PPID Pelaksana'
      }, { onConflict: 'no_pegawai' });

    if (pelaksanaError) {
      console.error('Error seeding PPID Pelaksana:', pelaksanaError);
      console.log('⚠️  Silakan jalankan script SQL untuk menambah kolom role di tabel ppid');
    } else {
      console.log('✅ PPID Pelaksana created (tanpa role - perlu update database)');
    }

    // 3. Atasan PPID
    const { error: atasanError } = await supabase
      .from('atasan_ppid')
      .upsert({
        no_pengawas: 'ATASAN001',
        email: 'atasan.ppid@diskominfo.go.id',
        hashed_password: defaultPassword,
        nama: 'Atasan PPID'
      }, { onConflict: 'no_pengawas' });

    if (atasanError) console.error('Error seeding Atasan PPID:', atasanError);
    else console.log('✅ Atasan PPID created');

    // 4. Admin
    const { error: adminError } = await supabase
      .from('admin')
      .upsert({
        email: 'admin@diskominfo.go.id',
        hashed_password: defaultPassword,
        nama: 'Administrator'
      }, { onConflict: 'email' });

    if (adminError) console.error('Error seeding Admin:', adminError);
    else console.log('✅ Admin created');

    // 5. Pemohon Test User
    const { error: pemohonError } = await supabase
      .from('pemohon')
      .upsert({
        email: 'pemohon.test@gmail.com',
        hashed_password: defaultPassword,
        nama: 'Pemohon Test',
        no_telepon: '081234567890',
        alamat: 'Jl. Test No. 123'
      }, { onConflict: 'email' });

    if (pemohonError) console.error('Error seeding Pemohon:', pemohonError);
    else console.log('✅ Pemohon Test created');

    console.log('\n📋 Default Login Credentials:');
    console.log('================================');
    console.log('1. PPID Utama:');
    console.log('   Email: ppid.utama@diskominfo.go.id');
    console.log('   Password: ppid2024');
    console.log('');
    console.log('2. PPID Pelaksana:');
    console.log('   Email: ppid.pelaksana@diskominfo.go.id');
    console.log('   Password: ppid2024');
    console.log('');
    console.log('3. Atasan PPID:');
    console.log('   Email: atasan.ppid@diskominfo.go.id');
    console.log('   Password: ppid2024');
    console.log('');
    console.log('4. Admin:');
    console.log('   Email: admin@diskominfo.go.id');
    console.log('   Password: ppid2024');
    console.log('');
    console.log('5. Pemohon Test:');
    console.log('   Email: pemohon.test@gmail.com');
    console.log('   Password: ppid2024');
    console.log('================================');

  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

seedUsers();