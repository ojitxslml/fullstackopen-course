import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm' // Adjust the import path as needed

test('BlogForm calls createBlog with correct details when a new blog is created', async () => {
  const createBlogMock = vi.fn() // Mock the createBlog function

  render(<BlogForm createBlog={createBlogMock} />)

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText('Title'), {
    target: { value: 'New Blog Title' },
  })
  fireEvent.change(screen.getByPlaceholderText('Author'), {
    target: { value: 'New Author' },
  })
  fireEvent.change(screen.getByPlaceholderText('Url'), {
    target: { value: 'https://newblog.com' },
  })

  // Simulate form submission
  fireEvent.click(screen.getByText('save'))

  // Check if createBlog was called with the correct arguments
  expect(createBlogMock).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Author',
    url: 'https://newblog.com',
  })

  // Optionally, check if the form was cleared after submission
  expect(screen.getByPlaceholderText('Title').value).toBe('')
  expect(screen.getByPlaceholderText('Author').value).toBe('')
  expect(screen.getByPlaceholderText('Url').value).toBe('')
})
