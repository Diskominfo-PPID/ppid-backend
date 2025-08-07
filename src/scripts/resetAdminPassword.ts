// Reset admin password
import dotenv from 'dotenv';
dotenv.config();

import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Resetting admin password...');

    // Hash password baru
    const newPassword = await bcrypt.hash('ppid2024', 10);

    // Update password admin
    const { data, error } = await supabase
      .from('admin')
      .update({ hashed_password: newPassword })
      .eq('email', 'admin@diskominfo.go.id')
      .select();

    if (error) {
      console.error('Error updating admin password:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Admin password reset successfully');
      console.log('📋 Admin Login:');
      console.log('   Email: admin@diskominfo.go.id');
      console.log('   Password: ppid2024');
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

resetAdminPassword();