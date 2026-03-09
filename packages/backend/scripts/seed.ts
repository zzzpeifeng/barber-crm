
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { AdminUser } from '../src/entities/admin-user.entity';
import { Merchant } from '../src/entities/merchant.entity';
import { MerchantUser } from '../src/entities/merchant-user.entity';
import { Shop } from '../src/entities/shop.entity';
import { Store } from '../src/entities/store.entity';
import { Member } from '../src/entities/member.entity';
import { MemberPointsSummary } from '../src/entities/member-points-summary.entity';
import { MemberPointsTransaction } from '../src/entities/member-points-transaction.entity';
import { MemberStoreLog } from '../src/entities/member-store-log.entity';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    AdminUser,
    Merchant,
    MerchantUser,
    Shop,
    Store,
    Member,
    MemberPointsSummary,
    MemberPointsTransaction,
    MemberStoreLog
  ],
  synchronize: true, // This will create tables
  dropSchema: true, // WARNING: This will drop tables before creating them. Use with caution!
  logging: false,
});

async function seed() {
  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connected.');

    console.log('Synchronizing schema (creating tables)...');
    await dataSource.synchronize(true); // Force sync to recreate tables
    console.log('Schema synchronized.');

    // 1. Create Admin User
    const adminRepo = dataSource.getRepository(AdminUser);
    // Use environment variable or default secure password for production
    const adminPasswordHash = await bcrypt.hash('123456', 10);
    
    const admin = adminRepo.create({
      username: 'admin',
      passwordHash: adminPasswordHash,
      realName: '系统管理员',
      role: 'super_admin',
      status: 1,
    });
    await adminRepo.save(admin);
    console.log('✅ Created Admin User: admin / 123456');

    // 2. Create Merchant
    const merchantRepo = dataSource.getRepository(Merchant);
    const merchantPasswordHash = await bcrypt.hash('123456', 10);
    
    const merchant = merchantRepo.create({
      name: '测试商户',
      phone: '13800138000',
      remark: '这是一个测试商户',
      loginAccount: 'merchant_test',
      passwordHash: merchantPasswordHash,
    });
    await merchantRepo.save(merchant);
    console.log('✅ Created Merchant: merchant_test / 123456');

    // 3. Create Merchant Users (Owner, Manager, Staff)
    const merchantUserRepo = dataSource.getRepository(MerchantUser);
    
    // Owner
    const owner = merchantUserRepo.create({
      merchantId: merchant.id,
      username: 'merchant_admin',
      passwordHash: merchantPasswordHash, // Reuse hash
      role: 'owner',
      realName: '商户老板',
      status: 1,
    });
    await merchantUserRepo.save(owner);
    console.log('✅ Created Merchant User: merchant_admin / 123456 (Owner)');

    // Manager
    const manager = merchantUserRepo.create({
      merchantId: merchant.id,
      username: 'merchant_manager',
      passwordHash: merchantPasswordHash,
      role: 'manager',
      realName: '店长',
      status: 1,
    });
    await merchantUserRepo.save(manager);
    console.log('✅ Created Merchant User: merchant_manager / 123456 (Manager)');

    // Staff
    const staff = merchantUserRepo.create({
      merchantId: merchant.id,
      username: 'merchant_staff',
      passwordHash: merchantPasswordHash,
      role: 'staff',
      realName: '员工小李',
      status: 1,
    });
    await merchantUserRepo.save(staff);
    console.log('✅ Created Merchant User: merchant_staff / 123456 (Staff)');

    // 4. Create Shop
    const shopRepo = dataSource.getRepository(Shop);
    const shop = shopRepo.create({
      merchantId: merchant.id,
      name: '测试商户总店',
      description: '这是测试商户的品牌总店',
    });
    await shopRepo.save(shop);
    console.log('✅ Created Shop: 测试商户总店');

    // 5. Create Store (Physical Location)
    const storeRepo = dataSource.getRepository(Store);
    const store = storeRepo.create({
      shopId: shop.id,
      name: '北京朝阳旗舰店',
      address: '北京市朝阳区三里屯SOHO A座101',
      phone: '010-88888888',
      remark: '24小时营业',
    });
    await storeRepo.save(store);
    console.log('✅ Created Store: 北京朝阳旗舰店');

    // 6. Create Members
    const memberRepo = dataSource.getRepository(Member);
    const pointsSummaryRepo = dataSource.getRepository(MemberPointsSummary);
    const pointsTransactionRepo = dataSource.getRepository(MemberPointsTransaction);

    const membersData = [
      { name: '张三', phone: '13900139000', address: '北京市朝阳区测试路1号' },
      { name: '李四', phone: '13900139001', address: '北京市海淀区测试路2号' },
      { name: '王五', phone: '13900139002', address: '北京市西城区测试路3号' },
    ];

    for (const mData of membersData) {
      const member = memberRepo.create({
        shopId: shop.id,
        ...mData,
      });
      await memberRepo.save(member);
      
      // Initialize Points Summary
      const summary = pointsSummaryRepo.create({
        shopId: shop.id,
        memberId: member.id,
        currentPoints: 100,
        totalEarned: 100,
        totalUsed: 0,
      });
      await pointsSummaryRepo.save(summary);

      // Create Initial Transaction
      const transaction = pointsTransactionRepo.create({
        shopId: shop.id,
        memberId: member.id,
        changeType: 'increase',
        pointsChange: 100,
        reason: '开卡赠送',
        operatorId: owner.id,
      });
      await pointsTransactionRepo.save(transaction);
    }
    console.log(`✅ Created ${membersData.length} Members with Points`);

    // 7. Verify Data Integrity
    console.log('\n--- Data Integrity Verification ---');
    
    const adminCount = await adminRepo.count();
    const merchantCount = await merchantRepo.count();
    const shopCount = await shopRepo.count();
    const storeCount = await storeRepo.count();
    const memberCount = await memberRepo.count();
    const pointsSummaryCount = await pointsSummaryRepo.count();

    console.log(`Admin Users: ${adminCount}`);
    console.log(`Merchants: ${merchantCount}`);
    console.log(`Shops: ${shopCount}`);
    console.log(`Stores: ${storeCount}`);
    console.log(`Members: ${memberCount}`);
    console.log(`Points Summaries: ${pointsSummaryCount}`);

    if (adminCount > 0 && merchantCount > 0 && shopCount > 0 && storeCount > 0 && memberCount === 3 && pointsSummaryCount === 3) {
      console.log('✅ Verification Passed: All expected data exists.');
    } else {
      console.error('❌ Verification Failed: Data counts do not match expectations.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
