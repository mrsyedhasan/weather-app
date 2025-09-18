const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('Missing API Key Test - Fixed', () => {
  let app;
  let originalEnv;
  let envBackupPath;
  let envPath;

  beforeAll(() => {
    originalEnv = { ...process.env };
    envPath = path.join(__dirname, '..', '.env');
    envBackupPath = path.join(__dirname, '..', '.env.backup');
  });

  afterAll(() => {
    process.env = originalEnv;
    // Restore .env file if it was backed up
    if (fs.existsSync(envBackupPath)) {
      fs.renameSync(envBackupPath, envPath);
    }
  });

  test('should test missing API key error (line 112)', async () => {
    // Backup the .env file
    if (fs.existsSync(envPath)) {
      fs.renameSync(envPath, envBackupPath);
    }
    
    // Clear module cache and import fresh app
    jest.resetModules();
    app = require('../server');

    const response = await request(app)
      .get('/weather/90210')
      .expect(500);

    expect(response.body).toEqual({
      error: 'Weather API key not configured'
    });

    // Restore .env file
    if (fs.existsSync(envBackupPath)) {
      fs.renameSync(envBackupPath, envPath);
    }
  });
});
