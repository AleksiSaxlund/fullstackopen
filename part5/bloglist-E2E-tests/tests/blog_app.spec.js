const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog } = require('./helper')
const blog = require('../../bloglist-backend/models/blog')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testiina Testinen',
        username: 'Testiina',
        password: 'salasana'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testerly Testings',
        username: 'Testerly',
        password: 'salasana'
      }
    })
    //console.log("asdasd", await response.json())

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Testiina', 'salasana')

      await expect(page.getByText('Testiina Testinen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Testiina', 'vaara_salasana')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Testiina Testinen logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Testiina', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'Sensein blogi', 'Miyamoto Musashi', 'www.com')

      await expect(page.getByText('Sensein blogi Miyamoto Musashi')).toBeVisible()
    })
    describe('When a blog already exists', () => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Very good blog', 'Miyamoto Musashi', 'www.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'like'}).click()

        await expect(page.getByText('Liked blog Very good blog')).toBeVisible()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blogs creator can remove it', async ({ page }) => {
        page.once('dialog', async dialog => {
          await dialog.accept()
        })
        
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'remove'}).click()

        await expect(page.getByText('Liked blog Very good blog')).not.toBeVisible()
      })

      test('only blogs creator can see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'view'}).click()

        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'Testerly', 'salasana')

        await page.getByRole('button', { name: 'view'}).click()

        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
    describe('When several blogs already exist', () => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Absolutely horrible blog', 'Someone', 'www.gov')
        await addBlog(page, 'Very good blog', 'Miyamoto Musashi', 'www.com')
        await addBlog(page, 'Mediocre blog', 'Me', 'www.org')
      })

      test('blogs are sorted by likes', async ({ page }) => {
        await page.getByTestId('blog-item')
          .filter({ hasText: 'Very good blog Miyamoto Musashi' })
          .getByRole('button', { name: 'view' })
          .click()

        const topLikeButton = page.getByTestId('blog-item')
          .filter({ hasText: 'Very good blog Miyamoto Musashi' })
          .getByRole('button', { name: 'like' })
        
        await topLikeButton.click()
        await topLikeButton.click()
        await topLikeButton.click()
        
        const blogs = await page.getByTestId('blog-item').all()
        await expect(blogs[0]).toContainText('Very good blog Miyamoto Musashi')
        await expect(blogs[1]).toContainText('Absolutely horrible blog Someone')
        await expect(blogs[2]).toContainText('Mediocre blog Me')

        await page.getByTestId('blog-item')
          .filter({ hasText: 'Mediocre blog Me' })
          .getByRole('button', { name: 'view' })
          .click()

        const mediumLikeButton = page.getByTestId('blog-item')
          .filter({ hasText: 'Mediocre blog Me' })
          .getByRole('button', { name: 'like' })

        await mediumLikeButton.click()

        const finalBlogs = await page.getByTestId('blog-item').all()
        await expect(finalBlogs[0]).toContainText('Very good blog Miyamoto Musashi')
        await expect(finalBlogs[1]).toContainText('Mediocre blog Me')
        await expect(finalBlogs[2]).toContainText('Absolutely horrible blog Someone')
      })
    })
  })
})