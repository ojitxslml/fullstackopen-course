import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

test('renders blog title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Blog Title',
    author: 'Author name',
    url: 'https://url.com',
    likes: 7,
    user: {
      username: 'testuser',
    },
  }

  render(<Blog blog={blog} />)

  const summaryElement = screen.getByText('Blog Title Author name')
  expect(summaryElement).toBeDefined()

  const urlElement = screen.queryByText('https://url.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 7')
  expect(likesElement).toBeNull()
})

test('displays blog URL and likes when view button is clicked', async () => {
  const blog = {
    title: 'Blog Title',
    author: 'Author name',
    url: 'https://url.com',
    likes: 7,
    user: {
      username: 'testuser',
    },
  }

  render(<Blog blog={blog} />)

  let urlElement = screen.queryByText('https://url.com')
  let likesElement = screen.queryByText('likes 7')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()

  const button = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(button)

  urlElement = screen.getByText('https://url.com')
  likesElement = screen.getByText('likes 7')
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    id: '321321312321321',
    title: 'Blog Title',
    author: 'Author name',
    url: 'https://url.com',
    likes: 7,
    user: {
      username: 'testuser',
      name: 'test',
      id: '32132131231244'
    },
  }

  const mockHandler = vi.fn()

  vi.spyOn(axios, 'put').mockResolvedValue({ data: { ...blog, likes: blog.likes + 1 } })

  render(<Blog blog={blog} updateBlogList={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

