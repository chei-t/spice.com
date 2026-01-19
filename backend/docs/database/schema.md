# Database Migrations Guide

## Overview

This guide covers database migration strategies, scripts, and best practices for the spice e-commerce platform. MongoDB migrations help manage schema changes, data transformations, and version upgrades safely.

---

## Table of Contents

1. [Migration Strategy](#migration-strategy)
2. [Migration Tools](#migration-tools)
3. [Migration Scripts](#migration-scripts)
4. [Common Migration Scenarios](#common-migration-scenarios)
5. [Rollback Procedures](#rollback-procedures)
6. [Best Practices](#best-practices)
7. [Migration Checklist](#migration-checklist)

---

## Migration Strategy

### Why Migrations?

- **Schema Evolution**: Add/remove fields safely
- **Data Transformation**: Update existing data format
- **Index Management**: Add/remove indexes
- **Data Consistency**: Ensure data integrity
- **Version Control**: Track database changes

### Migration Principles

1. **Backward Compatibility**: Old code should work with new schema
2. **Idempotency**: Migrations can run multiple times safely
3. **Atomic Operations**: Use transactions when possible
4. **Testability**: Test on staging before production
5. **Reversibility**: Always have rollback procedures

---

## Migration Tools

### Option 1: migrate-mongo (Recommended)

**Installation:**
```bash
npm install migrate-mongo
```

**Configuration (`migrate-mongo-config.js`):**
```javascript
module.exports = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017",
    databaseName: "ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};
```

**Commands:**
```bash
# Create new migration
npx migrate-mongo create add-product-views-field

# Run migrations
npx migrate-mongo up

# Rollback last migration
npx migrate-mongo down

# Check migration status
npx migrate-mongo status
```

### Option 2: Custom Migration Runner

**migrations/runner.js:**
```javascript
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

class MigrationRunner {
  constructor(mongoUri) {
    this.mongoUri = mongoUri;
    this.migrationsDir = path.join(__dirname, 'scripts');
  }

  async connect() {
    await mongoose.connect(this.mongoUri);
    console.log('Connected to MongoDB');
  }

  async disconnect() {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }

  async run(migrationName) {
    try {
      await this.connect();
      
      const migrationPath = path.join(this.migrationsDir, migrationName);
      const migration = require(migrationPath);
      
      console.log(`Running migration: ${migrationName}`);
      await migration.up();
      console.log(`Migration completed: ${migrationName}`);
      
    } catch (error) {
      console.error(`Migration failed: ${error.message}`);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async rollback(migrationName) {
    try {
      await this.connect();
      
      const migrationPath = path.join(this.migrationsDir, migrationName);
      const migration = require(migrationPath);
      
      console.log(`Rolling back migration: ${migrationName}`);
      await migration.down();
      console.log(`Rollback completed: ${migrationName}`);
      
    } catch (error) {
      console.error(`Rollback failed: ${error.message}`);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = MigrationRunner;
```

---

## Migration Scripts

### Migration Template

**migrations/YYYYMMDDHHMMSS-migration-name.js:**
```javascript
module.exports = {
  async up(db, client) {
    // Migration logic here
    // Use db for database operations
    // Use client for transactions
  },

  async down(db, client) {
    // Rollback logic here
    // Reverse the changes made in up()
  }
};
```

### Example 1: Add New Field

**migrations/20240115120000-add-product-views.js:**
```javascript
module.exports = {
  async up(db, client) {
    // Add 'views' field to all products
    await db.collection('products').updateMany(
      {},
      { 
        $set: { views: 0 } 
      }
    );
    
    console.log('Added views field to all products');
  },

  async down(db, client) {
    // Remove 'views' field from all products
    await db.collection('products').updateMany(
      {},
      { 
        $unset: { views: "" } 
      }
    );
    
    console.log('Removed views field from all products');
  }
};
```

### Example 2: Rename Field

**migrations/20240115120100-rename-user-name-fields.js:**
```javascript
module.exports = {
  async up(db, client) {
    // Rename 'name' to 'firstName' and add 'lastName'
    const users = await db.collection('users').find({ name: { $exists: true } }).toArray();
    
    for (const user of users) {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: { firstName, lastName },
          $unset: { name: "" }
        }
      );
    }
    
    console.log(`Updated ${users.length} users`);
  },

  async down(db, client) {
    // Combine firstName and lastName back to name
    const users = await db.collection('users').find({
      firstName: { $exists: true }
    }).toArray();
    
    for (const user of users) {
      const name = `${user.firstName} ${user.lastName}`.trim();
      
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: { name },
          $unset: { firstName: "", lastName: "" }
        }
      );
    }
    
    console.log(`Reverted ${users.length} users`);
  }
};
```

### Example 3: Add Index

**migrations/20240115120200-add-product-indexes.js:**
```javascript
module.exports = {
  async up(db, client) {
    const collection = db.collection('products');
    
    // Create compound index for category and price
    await collection.createIndex(
      { category: 1, price: 1 },
      { name: 'category_price_idx' }
    );
    
    // Create text index for search
    await collection.createIndex(
      { name: 'text', description: 'text' },
      { name: 'text_search_idx' }
    );
    
    console.log('Created product indexes');
  },

  async down(db, client) {
    const collection = db.collection('products');
    
    // Drop indexes
    await collection.dropIndex('category_price_idx');
    await collection.dropIndex('text_search_idx');
    
    console.log('Dropped product indexes');
  }
};
```

### Example 4: Data Transformation

**migrations/20240115120300-normalize-phone-numbers.js:**
```javascript
module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find({
      phone: { $exists: true, $ne: null }
    }).toArray();
    
    for (const user of users) {
      // Remove all non-numeric characters
      const normalized = user.phone.replace(/\D/g, '');
      
      // Add country code if missing (assuming US)
      const formattedPhone = normalized.length === 10 
        ? `+1${normalized}` 
        : `+${normalized}`;
      
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { phone: formattedPhone } }
      );
    }
    
    console.log(`Normalized ${users.length} phone numbers`);
  },

  async down(db, client) {
    // Difficult to reverse without backup
    // Consider logging original values before migration
    console.log('Rollback not implemented - requires backup');
  }
};
```

### Example 5: Collection Restructuring

**migrations/20240115120400-split-address-fields.js:**
```javascript
module.exports = {
  async up(db, client) {
    const orders = await db.collection('orders').find({
      address: { $exists: true }
    }).toArray();
    
    for (const order of orders) {
      if (typeof order.address === 'string') {
        // Parse address string into structured format
        const addressParts = order.address.split(',').map(s => s.trim());
        
        const shippingAddress = {
          address: addressParts[0] || '',
          city: addressParts[1] || '',
          state: addressParts[2] || '',
          postalCode: addressParts[3] || '',
          country: addressParts[4] || 'USA'
        };
        
        await db.collection('orders').updateOne(
          { _id: order._id },
          {
            $set: { shippingAddress },
            $unset: { address: "" }
          }
        );
      }
    }
    
    console.log(`Restructured ${orders.length} order addresses`);
  },

  async down(db, client) {
    const orders = await db.collection('orders').find({
      shippingAddress: { $exists: true }
    }).toArray();
    
    for (const order of orders) {
      const addr = order.shippingAddress;
      const address = `${addr.address}, ${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.country}`;
      
      await db.collection('orders').updateOne(
        { _id: order._id },
        {
          $set: { address },
          $unset: { shippingAddress: "" }
        }
      );
    }
    
    console.log(`Reverted ${orders.length} order addresses`);
  }
};
```

### Example 6: Aggregation Pipeline Migration

**migrations/20240115120500-calculate-order-totals.js:**
```javascript
module.exports = {
  async up(db, client) {
    // Update all orders with calculated totals
    const orders = await db.collection('orders').find({
      totalAmount: { $exists: false }
    }).toArray();
    
    for (const order of orders) {
      const subtotal = order.items.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity);
      }, 0);
      
      const taxAmount = subtotal * 0.08; // 8% tax
      const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const totalAmount = subtotal + taxAmount + shippingAmount;
      
      await db.collection('orders').updateOne(
        { _id: order._id },
        {
          $set: {
            subtotal,
            taxAmount,
            shippingAmount,
            totalAmount
          }
        }
      );
    }
    
    console.log(`Updated ${orders.length} orders with totals`);
  },

  async down(db, client) {
    await db.collection('orders').updateMany(
      {},
      {
        $unset: {
          subtotal: "",
          taxAmount: "",
          shippingAmount: "",
          totalAmount: ""
        }
      }
    );
    
    console.log('Removed total fields from orders');
  }
};
```

---

## Common Migration Scenarios

### Scenario 1: Adding Required Fields

```javascript
// Add field with default value first
await db.collection('products').updateMany(
  {},
  { $set: { category: 'uncategorized' } }
);

// Then update schema to make it required
// In Product model: category: { type: String, required: true }
```

### Scenario 2: Changing Field Types

```javascript
// Convert string prices to numbers
const products = await db.collection('products').find({
  price: { $type: 'string' }
}).toArray();

for (const product of products) {
  await db.collection('products').updateOne(
    { _id: product._id },
    { $set: { price: parseFloat(product.price) } }
  );
}
```

### Scenario 3: Removing Deprecated Fields

```javascript
// Remove unused fields
await db.collection('users').updateMany(
  {},
  {
    $unset: {
      oldField1: "",
      oldField2: "",
      deprecatedField: ""
    }
  }
);
```

### Scenario 4: Merging Collections

```javascript
// Merge user_profiles into users
const profiles = await db.collection('user_profiles').find().toArray();

for (const profile of profiles) {
  await db.collection('users').updateOne(
    { _id: profile.userId },
    {
      $set: {
        bio: profile.bio,
        avatar: profile.avatar,
        preferences: profile.preferences
      }
    }
  );
}

// Drop old collection
await db.collection('user_profiles').drop();
```

---

## Rollback Procedures

### Automatic Rollback

```bash
# Rollback last migration
npx migrate-mongo down

# Rollback specific migration
npx migrate-mongo down 20240115120000-add-product-views.js
```

### Manual Rollback

```javascript
// migrations/rollback-helper.js
const mongoose = require('mongoose');

async function rollbackToVersion(targetVersion) {
  const Changelog = mongoose.connection.collection('changelog');
  
  // Get migrations after target version
  const migrationsToRollback = await Changelog.find({
    version: { $gt: targetVersion }
  }).sort({ version: -1 }).toArray();
  
  for (const migration of migrationsToRollback) {
    console.log(`Rolling back: ${migration.fileName}`);
    const script = require(`./scripts/${migration.fileName}`);
    await script.down(mongoose.connection.db);
    
    await Changelog.deleteOne({ _id: migration._id });
  }
  
  console.log('Rollback completed');
}

module.exports = { rollbackToVersion };
```

### Backup Before Migration

```javascript
// migrations/backup-helper.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function createBackup(collectionName) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = `./backups/${timestamp}`;
  
  try {
    const command = `mongodump --uri="${process.env.MONGODB_URI}" --collection=${collectionName} --out=${backupDir}`;
    await execPromise(command);
    console.log(`Backup created: ${backupDir}`);
    return backupDir;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

async function restoreBackup(backupDir, collectionName) {
  try {
    const command = `mongorestore --uri="${process.env.MONGODB_URI}" --collection=${collectionName} ${backupDir}`;
    await execPromise(command);
    console.log('Restore completed');
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}

module.exports = { createBackup, restoreBackup };
```

---

## Best Practices

### 1. Testing Migrations

```javascript
// test/migrations/add-product-views.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const migration = require('../../migrations/20240115120000-add-product-views');

describe('Add Product Views Migration', () => {
  let mongoServer;
  let db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    db = mongoose.connection.db;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should add views field to products', async () => {
    // Insert test data
    await db.collection('products').insertOne({
      name: 'Test Product',
      price: 100
    });

    // Run migration
    await migration.up(db);

    // Verify
    const product = await db.collection('products').findOne({ name: 'Test Product' });
    expect(product.views).toBe(0);
  });

  it('should rollback successfully', async () => {
    await migration.down(db);

    const product = await db.collection('products').findOne({ name: 'Test Product' });
    expect(product.views).toBeUndefined();
  });
});
```

### 2. Logging

```javascript
// migrations/logger.js
const fs = require('fs').promises;
const path = require('path');

class MigrationLogger {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/migrations.log');
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    await fs.appendFile(this.logFile, logMessage);
    console.log(message);
  }

  async logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;
    
    await fs.appendFile(this.logFile, logMessage);
    console.error(error);
  }
}

module.exports = new MigrationLogger();
```

### 3. Validation

```javascript
// Validate data after migration
module.exports = {
  async up(db, client) {
    // Run migration
    await db.collection('products').updateMany(
      {},
      { $set: { views: 0 } }
    );

    // Validate
    const invalidProducts = await db.collection('products').countDocuments({
      views: { $exists: false }
    });

    if (invalidProducts > 0) {
      throw new Error(`Migration incomplete: ${invalidProducts} products missing views field`);
    }

    console.log('Migration validated successfully');
  }
};
```

### 4. Batch Processing

```javascript
// Process large datasets in batches
module.exports = {
  async up(db, client) {
    const BATCH_SIZE = 1000;
    let skip = 0;
    let processed = 0;

    while (true) {
      const products = await db.collection('products')
        .find({})
        .skip(skip)
        .limit(BATCH_SIZE)
        .toArray();

      if (products.length === 0) break;

      const bulkOps = products.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { views: 0 } }
        }
      }));

      await db.collection('products').bulkWrite(bulkOps);

      processed += products.length;
      skip += BATCH_SIZE;

      console.log(`Processed ${processed} products`);
    }

    console.log('Migration completed');
  }
};
```

### 5. Transactions (MongoDB 4.0+)

```javascript
module.exports = {
  async up(db, client) {
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // All operations in transaction
        await db.collection('products').updateMany(
          {},
          { $set: { views: 0 } },
          { session }
        );

        await db.collection('products').createIndex(
          { views: -1 },
          { session }
        );
      });

      console.log('Transaction completed successfully');
    } finally {
      await session.endSession();
    }
  }
};
```

---

## Migration Checklist

### Before Migration

- [ ] Backup database
- [ ] Test migration on staging
- [ ] Review migration script
- [ ] Check for data dependencies
- [ ] Estimate migration time
- [ ] Schedule maintenance window
- [ ] Notify team/users

### During Migration

- [ ] Monitor migration progress
- [ ] Watch for errors
- [ ] Check system resources
- [ ] Verify data integrity
- [ ] Test critical functions

### After Migration

- [ ] Validate all data
- [ ] Run application tests
- [ ] Monitor application logs
- [ ] Check performance metrics
- [ ] Update documentation
- [ ] Create rollback plan
- [ ] Delete old backups (after confirmation)

---

## Package.json Scripts

```json
{
  "scripts": {
    "migrate:up": "migrate-mongo up",
    "migrate:down": "migrate-mongo down",
    "migrate:status": "migrate-mongo status",
    "migrate:create": "migrate-mongo create",
    "migrate:test": "NODE_ENV=test jest test/migrations"
  }
}
```

---

## Environment-Specific Migrations

```javascript
// migrations/config/environments.js
module.exports = {
  development: {
    mongoUri: 'mongodb://localhost:27017/ecommerce_dev'
  },
  staging: {
    mongoUri: process.env.MONGODB_URI_STAGING
  },
  production: {
    mongoUri: process.env.MONGODB_URI_PROD
  }
};

// Run migration for specific environment
const env = process.env.NODE_ENV || 'development';
const config = require('./config/environments')[env];
```

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Author:** [solomon Mwangi]

**Contact:** solomonmuriithi370@gmail.com
**License:** MIT
