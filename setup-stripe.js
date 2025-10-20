#!/usr/bin/env node

/**
 * Quick Stripe Setup Script
 * This script helps you set up Stripe configuration quickly
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Stripe Setup Helper\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log("✅ .env.local file found");

  // Read existing content
  const content = fs.readFileSync(envPath, "utf8");

  // Check if Stripe keys are already configured
  if (content.includes("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")) {
    console.log("✅ Stripe keys appear to be configured");
  } else {
    console.log("⚠️  Stripe keys not found in .env.local");
    console.log("\n📝 Add these lines to your .env.local file:");
    console.log("");
    console.log("# Stripe Configuration");
    console.log(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here"
    );
    console.log(
      "STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here"
    );
    console.log("STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here");
    console.log("");
    console.log("🔗 Get your keys from: https://dashboard.stripe.com/apikeys");
  }
} else {
  console.log("❌ .env.local file not found");
  console.log("\n📝 Create a .env.local file with these contents:");
  console.log("");
  console.log("# Stripe Configuration");
  console.log(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here"
  );
  console.log(
    "STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here"
  );
  console.log("STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here");
  console.log("");
  console.log("# API Configuration");
  console.log(
    "NEXT_PUBLIC_API_BASE_URL=https://ivyway-backend-iu4z.onrender.com/api"
  );
  console.log("");
  console.log("🔗 Get your keys from: https://dashboard.stripe.com/apikeys");
}

console.log("\n🚀 After adding the keys:");
console.log("1. Restart your development server");
console.log("2. Check the browser console - the error should be gone");
console.log("3. Test the payment flow");

console.log("\n📚 For more help, see: STRIPE_SETUP_GUIDE.md");
