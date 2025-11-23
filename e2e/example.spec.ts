import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Micro SaaS/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('can navigate to pricing', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pricing' }).click()
  await expect(page).toHaveURL(/#pricing/)
})

test('sign in page loads', async ({ page }) => {
  await page.goto('/auth/signin')
  await expect(page.getByText('Sign in')).toBeVisible()
  await expect(page.getByPlaceholder('name@example.com')).toBeVisible()
})
