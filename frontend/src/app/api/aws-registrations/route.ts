import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { RegistrationData } from '@/types/registrations';

// Define the path for our JSON "database" file
const dataFilePath = path.join(process.cwd(), 'data', 'aws-registrations.json');

// Make sure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create the file if it doesn't exist
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Get all registrations
export async function GET(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    // Read the existing data
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const registrations = JSON.parse(fileContent);
    
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error retrieving registrations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve registrations' },
      { status: 500 }
    );
  }
}

// Add a new registration
export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const requestData = await request.json();
    const { name, email, phone, age } = requestData;
    
    // Simple validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Read existing registrations
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const registrations = JSON.parse(fileContent);
    
    // Check for duplicate email
    const existingRegistration = registrations.find(
      (reg: RegistrationData) => reg.email === email
    );
    
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Create new registration with timestamp
    const newRegistration = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      age: age || null,
      registeredAt: new Date().toISOString()
    };
    
    // Add to registrations array
    registrations.push(newRegistration);
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(registrations, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      registration: newRegistration 
    });
  } catch (error) {
    console.error('Error adding registration:', error);
    return NextResponse.json(
      { error: 'Failed to save registration' },
      { status: 500 }
    );
  }
}

// Check if a registration exists
export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Read existing registrations
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const registrations = JSON.parse(fileContent);
    
    // Check if email already exists
    const exists = registrations.some(
      (reg: RegistrationData) => reg.email === email
    );
    
    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json(
      { error: 'Failed to check registration' },
      { status: 500 }
    );
  }
}