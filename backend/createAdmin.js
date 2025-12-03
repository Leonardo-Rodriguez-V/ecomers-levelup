// Script para crear/actualizar usuario admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/levelup';

async function createAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Buscar si ya existe
    let admin = await User.findOne({ email: 'leo@gmail.com' });
    
    if (admin) {
      console.log('Admin encontrado, actualizando...');
      admin.role = 'admin';
      admin.passwordHash = await bcrypt.hash('ze615Aym', 10);
      await admin.save();
      console.log('✅ Admin actualizado exitosamente');
    } else {
      console.log('Admin no encontrado, creando nuevo...');
      const hash = await bcrypt.hash('ze615Aym', 10);
      await User.create({
        username: 'leo',
        email: 'leo@gmail.com',
        passwordHash: hash,
        birthdate: new Date('2000-01-01'),
        role: 'admin'
      });
      console.log('✅ Admin creado exitosamente');
    }

    console.log('\n📊 Credenciales de admin:');
    console.log('Email: leo@gmail.com');
    console.log('Contraseña: ze615Aym');
    console.log('Rol: admin');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.disconnect();
  }
}

createAdmin();
