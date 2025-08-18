#!/usr/bin/env python3
"""
Database Reset Script for ZEECLOTHS
This script will reset the database and create hardcoded users.
"""

import os
from app import app, init_db
from models import db, User
from werkzeug.security import generate_password_hash

def reset_database():
    """Reset the database and create users"""
    with app.app_context():
        # Drop all tables
        print("🗑️  Dropping all tables...")
        db.drop_all()
        
        # Create all tables
        print("🏗️  Creating all tables...")
        db.create_all()
        
        # Initialize database with sample data
        print("📊 Initializing sample data...")
        init_db()
        
        # Verify users were created
        admin_user = User.query.filter_by(email='admin@zeecloths.com').first()
        normal_user = User.query.filter_by(email='user@zeecloths.com').first()
        
        if admin_user:
            print("✅ Admin user created successfully!")
            print(f"   Username: {admin_user.username}")
            print(f"   Email: {admin_user.email}")
            print(f"   Is Admin: {admin_user.is_admin}")
        else:
            print("❌ Admin user creation failed!")
        
        if normal_user:
            print("✅ Normal user created successfully!")
            print(f"   Username: {normal_user.username}")
            print(f"   Email: {normal_user.email}")
            print(f"   Is Admin: {normal_user.is_admin}")
        else:
            print("❌ Normal user creation failed!")
        
        print("\n🎉 Database reset completed!")
        print("\n📋 Login Credentials:")
        print("=" * 40)
        print("🔐 ADMIN USER:")
        print("   Username: admin")
        print("   Email: admin@zeecloths.com")
        print("   Password: admin123")
        print("   Access: Full admin privileges")
        print()
        print("👤 NORMAL USER:")
        print("   Username: user")
        print("   Email: user@zeecloths.com")
        print("   Password: user123")
        print("   Access: Shopping and profile management")
        print("=" * 40)

if __name__ == '__main__':
    print("🚀 ZEECLOTHS Database Reset Tool")
    print("=" * 40)
    
    # Check if database file exists
    db_path = 'instance/zeecloths.db'
    if os.path.exists(db_path):
        print(f"📁 Found existing database: {db_path}")
        response = input("⚠️  This will delete all existing data. Continue? (y/N): ")
        if response.lower() != 'y':
            print("❌ Operation cancelled.")
            exit()
    
    reset_database()
