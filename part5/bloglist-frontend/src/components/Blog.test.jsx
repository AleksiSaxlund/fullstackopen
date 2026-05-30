import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blogToShow = {
  title: 'Testing blog',
  Author: 'Testiina Testinen',
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

test('renders title', () => {

  render(<Blog blog={blogToShow} user={loggedUser} />)

  const element = screen.getByText('Testing blog')
  expect(element).toBeDefined()
})

test('clicking the view button shows all info', async () => {

  render(<Blog blog={blogToShow} user={loggedUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('www.com')
  const likes = screen.getByText('likes 8')
  const owner = screen.getByText('Testiina Testinen')

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(owner).toBeDefined()
})

test('liking blog twice calls updateBlog twice', async () => {
  const user = userEvent.setup()
  const updateBlog = vi.fn()

  render(<Blog blog={blogToShow} user={loggedUser} updateBlog={updateBlog} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
