import mongoose from 'mongoose';

const OLD_URI = 'mongodb+srv://gauravpatil:GauravPatil06@cluster0.jv91xdd.mongodb.net/StudyPlan?retryWrites=true&w=majority';
const NEW_URI = 'mongodb+srv://gauravpatil:GauravPatil06@cluster0.jv91xdd.mongodb.net/StudyHub?retryWrites=true&w=majority';

async function migrate() {
    try {
        console.log('--- Database Migration Started ---');
        
        // Connect to old DB
        const srcConn = await mongoose.createConnection(OLD_URI).asPromise();
        const destConn = await mongoose.createConnection(NEW_URI).asPromise();
        
        console.log('Connected to both databases.');

        const collections = await srcConn.db.listCollections().toArray();
        console.log(`Found ${collections.length} collections to move.`);

        for (const collInfo of collections) {
            const name = collInfo.name;
            console.log(`Moving collection: ${name}...`);

            const docs = await srcConn.db.collection(name).find().toArray();
            if (docs.length > 0) {
                await destConn.db.collection(name).insertMany(docs);
                console.log(`  Done: ${docs.length} documents copied.`);
            } else {
                console.log(`  Skipped: Collection is empty.`);
            }
        }

        console.log('\nMigration successful! All data moved to StudyHub.');
        console.log('You can now safely delete the "StudyPlan" database in MongoDB Atlas dashboard.');
        
        await srcConn.close();
        await destConn.close();
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
