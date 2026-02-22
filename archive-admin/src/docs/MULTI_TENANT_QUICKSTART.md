# Multi-Tenant CMS - Quick Start Guide

## 🚀 What Changed?

Your Archive Admin is now a **Multi-Tenant CMS Manager**! You can now manage multiple organizations (tenants) from a single interface.

## 🎯 Key Features at a Glance

- **Tenant Switcher** in the sidebar - Switch between organizations instantly
- **Tenant Management Page** - Create, edit, and manage all your tenants
- **Isolated Data** - Each tenant has completely separate content
- **Plan Support** - Free, Starter, Professional, and Enterprise plans
- **Visual Context** - Always know which tenant you're managing

## 📍 Where to Find Things

### Sidebar (Left)
- **Tenant Switcher** - At the top, shows current tenant
- **Tenants Menu Item** - New menu item to manage all tenants
- **Tenant Context Panel** - Shows current plan and status

### Header (Top)
- **Tenant Badge** - Quick indicator of current tenant
- Click it to go to tenant management

### Dashboard
- **Tenant Overview Card** - Shows current tenant info
- **Tenant Count** - See how many tenants you have

## 🎨 Visual Guide

### Tenant Plans (Color Coded)
- 🟣 **Enterprise** - Purple badge
- 🔵 **Professional** - Blue badge  
- 🟢 **Starter** - Green badge
- ⚪ **Free** - Gray badge

### Tenant Status
- 🟢 **Active** - Green indicator
- ⚪ **Inactive** - Gray indicator
- 🔴 **Suspended** - Red indicator

## 🔄 How to Use

### First Time Setup

1. **Login** to the application
2. You'll see the **Tenant Switcher** in the sidebar
3. Click **"Create New Tenant"** or navigate to **Tenants** page
4. Fill in tenant details:
   - Name (e.g., "My Company")
   - Slug (auto-generated, e.g., "my-company")
   - Domain (optional, e.g., "mycompany.com")
   - Plan (Free, Starter, Professional, Enterprise)
5. Click **"Create Tenant"**

### Switching Tenants

**Method 1: Sidebar Switcher**
1. Click the **Tenant Switcher** at the top of sidebar
2. Select a tenant from the dropdown
3. Page reloads with new tenant context

**Method 2: Tenants Page**
1. Go to **Tenants** page from sidebar
2. Click **"Switch"** button on any tenant card
3. Page reloads with new tenant context

### Managing Tenants

**View All Tenants**
- Click **"Tenants"** in the sidebar
- See all your tenants in a grid view
- Search using the search bar

**Edit a Tenant**
- Go to Tenants page
- Click the **⋮** menu on a tenant card
- Select **"Edit"**
- Update details and save

**Delete a Tenant**
- Go to Tenants page
- Click the **⋮** menu on a tenant card
- Select **"Delete"**
- Confirm deletion

## 💡 Understanding Tenant Context

### What is Tenant Context?
When you select a tenant, ALL your actions are scoped to that tenant:
- Posts you create belong to that tenant
- Categories are tenant-specific
- Comments are tenant-specific
- Support tickets are tenant-specific

### Visual Indicators
You'll always see which tenant is active:
- **Sidebar**: Tenant name in switcher
- **Header**: Tenant badge
- **Dashboard**: Tenant overview card
- **Pages**: Tenant context banner (on some pages)

## 🎯 Common Workflows

### Scenario 1: Managing Multiple Clients
1. Create a tenant for each client
2. Switch to client's tenant
3. Manage their content (posts, categories, etc.)
4. Switch to another client when needed

### Scenario 2: Multiple Brands
1. Create a tenant for each brand
2. Each brand has isolated content
3. Switch between brands easily
4. Maintain separate content strategies

### Scenario 3: Development & Production
1. Create "Development" tenant
2. Create "Production" tenant
3. Test in Development tenant
4. Deploy to Production tenant

## 🔍 Finding Your Way Around

### Sidebar Menu
```
📊 Dashboard       - Overview of current tenant
🏢 Tenants         - Manage all tenants (NEW!)
📁 Categories      - Tenant-specific categories
📝 Posts           - Tenant-specific posts
💬 Comments        - Tenant-specific comments
🎧 Support         - Tenant-specific tickets
👤 Profile         - Your user profile
```

### Tenant Management Page
- **Search Bar** - Find tenants quickly
- **Create Button** - Add new tenant
- **Tenant Cards** - Visual overview of each tenant
  - Shows plan badge
  - Shows status
  - Shows stats (posts, users, categories)
  - Quick actions menu

## ⚙️ Settings & Configuration

### Tenant Settings (Per Tenant)
- Name and slug
- Custom domain
- Subscription plan
- Status (active/inactive/suspended)

### User Settings (Global)
- Your profile settings
- Applies across all tenants

## 🚨 Important Notes

### Data Isolation
- Each tenant's data is completely separate
- You cannot see other tenants' data when switched
- Switching tenants reloads the page to ensure clean context

### Tenant Selection Required
- Some pages require a tenant to be selected
- You'll see a helpful message if no tenant is selected
- Simply select or create a tenant to continue

### Automatic Persistence
- Your last selected tenant is remembered
- When you login, you'll be in the same tenant
- Stored in browser localStorage

## 🐛 Troubleshooting

### "No Tenant Selected" Message
**Solution**: Click "Select Tenant" or create your first tenant

### Can't See My Content
**Solution**: Make sure you're in the correct tenant (check sidebar switcher)

### Tenant Switch Not Working
**Solution**: 
1. Check your internet connection
2. Refresh the page
3. Try logging out and back in

### Missing Tenants
**Solution**: 
1. Check if you have permission to access them
2. Verify with your administrator

## 📱 Mobile Usage

The multi-tenant interface is fully responsive:
- Tenant switcher works on mobile
- Tenant cards stack vertically
- All features accessible on small screens

## 🎓 Best Practices

1. **Use Descriptive Names** - Make tenant names clear and recognizable
2. **Consistent Slugs** - Use lowercase with hyphens
3. **Check Context** - Always verify which tenant you're in before making changes
4. **Regular Switching** - Don't forget to switch tenants when needed
5. **Plan Appropriately** - Choose the right plan for each tenant's needs

## 🎉 You're Ready!

You now have a powerful multi-tenant CMS at your fingertips. Start by:
1. Creating your first tenant
2. Adding some content
3. Creating another tenant
4. Switching between them

Enjoy managing multiple organizations with ease! 🚀
