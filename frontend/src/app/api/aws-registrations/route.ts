import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { RegistrationData } from '@/types/registrations';
import { Resend } from 'resend';

// Define the path for our JSON "database" file
const dataFilePath = path.join(process.cwd(), 'data', 'aws-registrations.json');

// Check if we're in production environment (Vercel, etc.)
const isProduction = process.env.NODE_ENV === 'production';

// Make sure the data directory exists
const ensureDataDirectory = () => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create the file if it doesn't exist
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
    }
    return true;
  } catch (error) {
    console.error('Error ensuring data directory:', error);
    return false;
  }
};

// Get all registrations
export async function GET(request: NextRequest) {
  try {
    // Try to use file system - this works in development and may work in some production setups
    try {
      ensureDataDirectory();
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const registrations = JSON.parse(fileContent);
        return NextResponse.json({ registrations });
      }
    } catch (fsError) {
      console.warn('Could not read from file system:', fsError);
      // Continue to fallback
    }

    // Fallback to empty array if file system failed
    return NextResponse.json({ registrations: [] });
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
    const requestData = await request.json();
    const { name, email, phone, age } = requestData;
    
    // Simple validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
    
    let registrationSaved = false;
    let existingFound = false;
    
    // Try to use file system first
    try {
      ensureDataDirectory();
      let registrations = [];
      
      // Try to read existing registrations
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        registrations = JSON.parse(fileContent);
        
        // Check for duplicate email
        const existingRegistration = registrations.find(
          (reg: RegistrationData) => reg.email === email
        );
        
        if (existingRegistration) {
          existingFound = true;
          return NextResponse.json(
            { error: 'Email already registered' },
            { status: 409 }
          );
        }
      }
      
      // If we got here, no duplicate was found
      // Add to registrations array
      registrations.push(newRegistration);
      
      // Write back to file
      fs.writeFileSync(dataFilePath, JSON.stringify(registrations, null, 2));
      registrationSaved = true;
    } catch (fsError) {
      console.warn('Could not save to file system:', fsError);
      // Continue to email notification fallback
    }
    
    // If we're in production or couldn't save to the file system,
    // send a notification email to the admin as a backup
    if (isProduction || !registrationSaved) {
      try {
        // Send notification email to admin
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
          const resend = new Resend(apiKey);
          await resend.emails.send({
            from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'no-reply@hackwknd.sarawak.digital',
            to: 'admin@hackwknd.sarawak.digital', // Change this to your admin email
            subject: 'New AWS Innovation Challenge Registration',
            html: `
              <h1>New Registration</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Age:</strong> ${age || 'Not provided'}</p>
              <p><strong>Registered At:</strong> ${newRegistration.registeredAt}</p>
            `,
          });
        }
      } catch (emailError) {
        console.error('Error sending admin notification email:', emailError);
        // Don't fail the registration if email fails
      }
    }
    
    // Return success regardless of how we stored it
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
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    try {
      // Try to read from file system
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const registrations = JSON.parse(fileContent);
        
        // Check if email already exists
        const exists = registrations.some(
          (reg: RegistrationData) => reg.email === email
        );
        
        return NextResponse.json({ exists });
      }
    } catch (fsError) {
      console.warn('Could not read from file system:', fsError);
      // Fall through to default response
    }
    
    // If we can't check the file system or it doesn't exist,
    // return false (not registered) as a safe default
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json(
      { error: 'Failed to check registration' },
      { status: 500 }
    );
  }
}