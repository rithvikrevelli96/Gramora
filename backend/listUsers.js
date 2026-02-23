import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function listUsers() {
    try {
        console.log('🔍 Connecting to MongoDB...\n');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas (gramora database)');

        // Get collection info
        const connection = mongoose.connection;
        const collections = connection.collections;

        console.log('\n📋 Collections found:');
        Object.keys(collections).forEach(name => {
            console.log(`  ✓ ${name}`);
        });

        // Count users
        const userCount = await User.countDocuments();
        console.log(`\n👥 Total users in database: ${userCount}`);

        if (userCount > 0) {
            console.log('\n📝 All users (without passwords):');
            const users = await User.find({}, { password: 0 });
            users.forEach((user, index) => {
                console.log(`\n  ${index + 1}. User:`);
                console.log(`     └─ Username: ${user.username}`);
                console.log(`     └─ Email: ${user.email}`);
                console.log(`     └─ ID: ${user._id}`);
                console.log(`     └─ Created: ${user.createdAt}`);
            });
        } else {
            console.log('⚠️  No users found in database');
        }

        console.log('\n✅ Database check complete');
        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listUsers();
