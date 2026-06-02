import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './createBlogForm'

test('<CreateBlogForm /> calls createBlog properly on submit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(
    <MemoryRouter>
      <CreateBlogForm createBlog={createBlog} />
    </MemoryRouter>
  )

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'Testing blog')
  await user.type(authorInput, 'Testiina Testinen')
  await user.type(urlInput, 'www.com')
  await user.click(submitButton)
  //console.log(createBlog.mock.calls[0][0])
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Testiina Testinen')
  expect(createBlog.mock.calls[0][0].url).toBe('www.com')
})