#!/usr/bin/env node

/**
 * Simple script to test the backend API connection
 * Run with: node scripts/test-api.js
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function testAPI() {
    console.log('🔍 Testing API connection...\n');
    console.log(`API URL: ${API_URL}\n`);

    try {
        // Test 1: Health check
        console.log('1️⃣  Testing health endpoint...');
        const healthResponse = await fetch(`${API_URL}/hello`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health check passed:', healthData);
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
        }

        // Test 2: Get categories
        console.log('\n2️⃣  Testing categories endpoint...');
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log('✅ Categories endpoint working');
            console.log(`   Found ${categoriesData.data?.length || 0} categories`);
            if (categoriesData.data && categoriesData.data.length > 0) {
                console.log('   Sample category:', {
                    id: categoriesData.data[0].id,
                    label: categoriesData.data[0].label,
                    slug: categoriesData.data[0].slug,
                    status: categoriesData.data[0].status,
                });
            }
        } else {
            console.log('❌ Categories endpoint failed:', categoriesResponse.status);
            const errorText = await categoriesResponse.text();
            console.log('   Error:', errorText);
        }

        // Test 3: Get subcategories
        console.log('\n3️⃣  Testing subcategories endpoint...');
        const subcategoriesResponse = await fetch(`${API_URL}/sub-categories`);
        if (subcategoriesResponse.ok) {
            const subcategoriesData = await subcategoriesResponse.json();
            console.log('✅ Subcategories endpoint working');
            console.log(`   Found ${subcategoriesData.data?.length || 0} subcategories`);
        } else {
            console.log('❌ Subcategories endpoint failed:', subcategoriesResponse.status);
        }

        console.log('\n✨ API test completed!\n');
    } catch (error) {
        console.error('\n❌ API test failed with error:', error.message);
        console.error('\n💡 Make sure the backend is running on', API_URL);
        console.error('   Run: cd cortex && make dev\n');
        process.exit(1);
    }
}

testAPI();
