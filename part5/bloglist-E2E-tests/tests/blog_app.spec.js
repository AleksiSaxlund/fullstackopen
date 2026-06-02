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
    await page.getByRole('link', { name: 'login'}).click()
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Testiina', 'salasana')

      await expect(page.getByText('logged in as Testiina Testinen')).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog'})).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout'})).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Testiina', 'vaara_salasana')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByRole('link', { name: 'login'})).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog'})).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'logout'})).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Testiina', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'Sensein blogi', 'Miyamoto Musashi', 'www.com')

      await expect(page.getByRole('link', { name: 'Sensein blogi by Miyamoto Musashi' })).toBeVisible()
    })
    describe('When a blog already exists', () => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Very good blog', 'Miyamoto Musashi', 'www.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'Very good blog by Miyamoto Musashi'}).click()
        await page.getByRole('button', { name: 'like'}).click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blogs creator can remove it', async ({ page }) => {
        page.once('dialog', async dialog => {
          await dialog.accept()
        })
        
        await page.getByRole('link', { name: 'Very good blog by Miyamoto Musashi'}).click()
        await page.getByRole('button', { name: 'remove'}).click()

        await expect(page.getByText('removed blog Very good blog by Miyamoto Musashi')).toBeVisible()
        await expect(page.getByRole('link', { name: 'Very good blog by Miyamoto Musashi'})).not.toBeVisible()
      })

      test('non-cretor of a blog can not see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'Testerly', 'salasana')

        await page.getByRole('link', { name: 'Very good blog by Miyamoto Musashi'}).click()

        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})