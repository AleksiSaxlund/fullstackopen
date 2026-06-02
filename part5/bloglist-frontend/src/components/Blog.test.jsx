import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blogToShow = {
  title: 'Testing blog',
  author: 'Testiina Testinen',
  url: 'www.com',
  likes: 8,
  user: {
    username: 'Testiina',
    name: 'Testiina Testinen',
    id: '6a1954eded570504534263fd'
  },
  id: '6a19a46536d5e4f3398ca7f1'
}

const loggedUser = {
  name: 'Testiina Testinen',
  username: 'Testiina'
}

const OtherLoggedUser = {
  name: 'Testerly Testings',
  username: 'Testerly'
}

test('renders title', () => {

  render(
    <MemoryRouter>
      <Blog blog={blogToShow} user={loggedUser} />
    </MemoryRouter>
  )

  const element = screen.getByRole('heading', { name: /Testiina Testinen: Testing blog/ })
  expect(element).toBeDefined()
})

test('logged out user can not see like or remove buttons', async () => {

  render(
    <MemoryRouter>
      <Blog blog={blogToShow} user={null} />
    </MemoryRouter>
  )

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })

  const url = screen.getByText('www.com')
  const likes = screen.getByText('likes 8')
  const owner = screen.getByRole('heading', { name: /Testiina Testinen: Testing blog/ })

  expect(likeButton).not.toBeInTheDocument()
  expect(removeButton).not.toBeInTheDocument()

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(owner).toBeDefined()
})

test('logged in user can see only like button when not creator of blog', async () => {

  render(
    <MemoryRouter>
      <Blog blog={blogToShow} user={OtherLoggedUser} />
    </MemoryRouter>
  )

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })

  const url = screen.getByText('www.com')
  const likes = screen.getByText('likes 8')
  const owner = screen.getByRole('heading', { name: /Testiina Testinen: Testing blog/ })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).not.toBeInTheDocument()

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(owner).toBeDefined()
})

test('logged in user can see like and remove buttons when creator of blog', async () => {

  render(
    <MemoryRouter>
      <Blog blog={blogToShow} user={loggedUser} />
    </MemoryRouter>
  )

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })

  const url = screen.getByText('www.com')
  const likes = screen.getByText('likes 8')
  const owner = screen.getByRole('heading', { name: /Testiina Testinen: Testing blog/ })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).toBeInTheDocument()

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(owner).toBeDefined()
})

test('liking blog twice calls updateBlog twice', async () => {
  const user = userEvent.setup()
  const updateBlog = vi.fn()

  render(
    <MemoryRouter>
      <Blog blog={blogToShow} user={loggedUser} updateBlog={updateBlog} />
    </MemoryRouter>
  )

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
