import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
    try {
        console.log('🔍 Checking MongoDB Connection...');

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB Atlas');

        // Get database info
        const db = mongoose.connection;
        console.log(`\n📊 Database Name: gramora`);
        console.log(`📊 Connection State: ${db.readyState === 1 ? 'Connected' : 'Disconnected'}`);

        // List collections
        const collections = await db.db.listCollections().toArray();
        console.log(`\n📋 Collections in database:`);
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });

        // Check users collection
        if (collections.some(col => col.name === 'users')) {
            console.log(`\n✅ Users collection EXISTS`);

            // Count users
            const User = mongoose.model('User', new mongoose.Schema({
                username: String,
                email: String,
                password: String,
                createdAt: Date
            }));

            const count = await User.countDocuments();
            console.log(`\n👥 Total users in database: ${count}`);

            // List all users (without passwords)
            if (count > 0) {
                const users = await User.find({}, { password: 0 }).exec();
                console.log(`\n📝 All users:`);
                users.forEach((user, index) => {
                    console.log(`  ${index + 1}. Username: ${user.username}, Email: ${user.email}, ID: ${user._id}`);
                });
            }
        } else {
            console.log(`\n❌ Users collection NOT found`);
        }

        await mongoose.disconnect();
        console.log(`\n✅ Disconnected from MongoDB`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkDatabase();
