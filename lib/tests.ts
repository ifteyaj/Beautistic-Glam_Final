/**
 * ============================================
 * BACKEND TESTING & DEBUG REPORT
 * ============================================
 * Tests for all Supabase backend flows
 * Run these in browser console after deployment
 * ============================================
 * 
 * USAGE: Copy this file content to browser console in dev mode
 * OR copy relevant functions to test individually
 * ============================================
 */

import { supabase } from '../lib/supabase';

// Test configuration
const config = {
  supabaseUrl: 'https://hybxyojngxzurpdukgyi.supabase.co',
  testEmail: 'test@example.com',
  testPassword: 'TestPassword123!',
  testName: 'Test User',
};

// ============================================
// PHASE 1: TEST AUTHENTICATION
// ============================================

export async function testSignup() {
  console.log('🧪 Testing Signup...');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: config.testEmail,
      password: config.testPassword,
    });
    
    if (error) {
      console.log('❌ Signup failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Signup successful:', data.user?.email);
    return { success: true, user: data.user };
  } catch (e: any) {
    console.log('❌ Signup error:', e.message);
    return { success: false, error: e.message };
  }
}

export async function testSignIn(email = config.testEmail, password = config.testPassword) {
  console.log('🧪 Testing Sign In...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('❌ Sign in failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Sign in successful:', data.user?.email);
    return { success: true, user: data.user };
  } catch (e: any) {
    console.log('❌ Sign in error:', e.message);
    return { success: false, error: e.message };
  }
}

export async function testSignOut() {
  console.log('🧪 Testing Sign Out...');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('❌ Sign out failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Sign out successful');
    return { success: true };
  } catch (e: any) {
    console.log('❌ Sign out error:', e.message);
    return { success: false, error: e.message };
  }
}

export async function testSessionPersistence() {
  console.log('🧪 Testing Session Persistence...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Get session failed:', error.message);
      return { success: false, error: error.message };
    }
    
    if (session) {
      console.log('✅ Session persists:', session.user?.email);
      return { success: true, session };
    } else {
      console.log('⚠️ No active session');
      return { success: true, session: null };
    }
  } catch (e: any) {
    console.log('❌ Session check error:', e.message);
    return { success: false, error: e.message };
  }
}

// ============================================
// PHASE 2: TEST DATABASE OPERATIONS
// ============================================

export async function testGetProducts() {
  console.log('🧪 Testing Get Products...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(10);
    
    if (error) {
      console.log('❌ Get products failed:', error.message);
      return { success: false, error: error.message, products: [] };
    }
    
    console.log('✅ Products loaded:', data?.length || 0, 'products');
    return { success: true, products: data };
  } catch (e: any) {
    console.log('❌ Get products error:', e.message);
    return { success: false, error: e.message, products: [] };
  }
}

export async function testOrdersTable() {
  console.log('🧪 Testing Orders Table...');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('does not exist')) {
      console.log('❌ Orders table missing:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Orders table exists');
    return { success: true };
  } catch (e: any) {
    console.log('❌ Orders table error:', e.message);
    return { success: false, error: e.message };
  }
}

// ============================================
// PHASE 3: RUN ALL TESTS
// ============================================

export async function runAllTests() {
  console.log('========================================');
  console.log('🧪 RUNNING ALL BACKEND TESTS');
  console.log('========================================\n');
  
  // Test Products
  console.log('\n--- PRODUCTS TESTS ---');
  const products = await testGetProducts();
  await testOrdersTable();
  
  // Test Auth
  console.log('\n--- AUTH TESTS ---');
  await testSignup();
  await testSignIn();
  await testSessionPersistence();
  await testSignOut();
  
  console.log('\n========================================');
  console.log('✅ ALL TESTS COMPLETED');
  console.log('========================================\n');
}