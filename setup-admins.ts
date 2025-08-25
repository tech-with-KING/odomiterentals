import { adminDb } from './firebase-admin';

async function addAdminUser(email: string, name?: string) {
  try {
    console.log('Adding admin user:', email);
    
    // Check if admin already exists
    const adminsRef = adminDb.collection('admins');
    const existingSnapshot = await adminsRef.where('email', '==', email).get();
    
    if (!existingSnapshot.empty) {
      console.log('Admin already exists:', email);
      return;
    }

    // Add new admin
    const adminDoc = {
      email: email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const docRef = await adminsRef.add(adminDoc);
    console.log('Admin added successfully with ID:', docRef.id);
    
  } catch (error) {
    console.error('Error adding admin:', error);
  }
}

// Add some admin users - replace with your actual admin email addresses
async function setupAdmins() {
  await addAdminUser('kingsley@example.com', 'Kingsley'); // Replace with your actual email
  await addAdminUser('admin@odomiterentals.com', 'Admin');
  
  console.log('Admin setup complete!');
  process.exit(0);
}

setupAdmins();
