const { test, expect } = require('@playwright/test');

test.describe('Weather App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '🌤️ Weather App' })).toBeVisible();
    await expect(page.getByText('Get the latest weather information by entering a US zip code')).toBeVisible();
  });

  test('should have a search input and button', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await expect(searchInput).toBeVisible();
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeDisabled(); // Should be disabled when input is empty
  });

  test('should enable search button when zip code is entered', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await searchInput.fill('90210');
    await expect(searchButton).toBeEnabled();
  });

  test('should show error for invalid zip code format', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await searchInput.fill('invalid');
    await searchButton.click();
    
    await expect(page.getByText('Invalid zip code format')).toBeVisible();
  });

  test('should show error for empty zip code', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await searchInput.fill('');
    await searchButton.click();
    
    // Button should be disabled, so no error should appear
    await expect(searchButton).toBeDisabled();
  });

  test('should show API key error when no API key is configured', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await searchInput.fill('90210');
    await searchButton.click();
    
    // Should show API key error since we haven't configured one
    await expect(page.getByText('Weather API key not configured')).toBeVisible();
  });

  test('should show loading state when searching', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    const searchButton = page.getByRole('button', { name: 'Get Weather' });
    
    await searchInput.fill('90210');
    await searchButton.click();
    
    // Should show loading spinner
    await expect(page.getByTestId('spinner')).toBeVisible();
  });

  test('should have proper form validation', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Enter US zip code (e.g., 90210)');
    
    // Test various invalid formats
    const invalidZipCodes = ['123', '12345-', 'abcde', '1234', '123456'];
    
    for (const zipCode of invalidZipCodes) {
      await searchInput.fill(zipCode);
      await searchInput.press('Enter');
      
      // Should show validation error
      await expect(page.getByText('Invalid zip code format')).toBeVisible();
      
      // Clear input for next test
      await searchInput.clear();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that elements are still visible and properly arranged
    await expect(page.getByRole('heading', { name: '🌤️ Weather App' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter US zip code (e.g., 90210)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Weather' })).toBeVisible();
  });

  test('should display footer information', async ({ page }) => {
    await expect(page.getByText('Powered by OpenWeatherMap API')).toBeVisible();
  });
});

test.describe('Backend API Health Check', () => {
  test('should respond to health check endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3001/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('OK');
    expect(data.message).toBe('Weather API is running');
  });

  test('should return 400 for invalid zip code', async ({ request }) => {
    const response = await request.get('http://localhost:3001/weather/invalid');
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data.error).toContain('Invalid zip code format');
  });

  test('should return 500 for missing API key', async ({ request }) => {
    const response = await request.get('http://localhost:3001/weather/90210');
    expect(response.status()).toBe(500);
    
    const data = await response.json();
    expect(data.error).toContain('Weather API key not configured');
  });

  test('should return 404 for non-existent routes', async ({ request }) => {
    const response = await request.get('http://localhost:3001/nonexistent');
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data.error).toBe('Route not found');
  });
});
