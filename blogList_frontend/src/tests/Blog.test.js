import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../components/Blog';

describe('<Blog />', () => {
  let blog;

  beforeEach(() => {
    blog = {
      title: 'foo',
      author: 'bar',
      likes: 0,
      url: 'http://nowhere.net',
      user: {
        name: 'Pyle'
      }
    };
  });

  test('renders title and author', () => {
    const { container } = render(<Blog blog={blog} like={() => null} deleteBlog={null} />);

    const titleCheck = screen.getByText(blog.title, { exact: false });
    const authorCheck = screen.getByText(blog.author, { exact: false });

    expect(titleCheck).toBeDefined();
    expect(authorCheck).toBeDefined();
  });

  test('does not display url or number of likes at start', () => {
    const { container } = render(<Blog blog={blog} like={() => null} deleteBlog={null} />);

    const url = container.querySelector('.url');
    const likes = container.querySelector('.likes');

    expect(url).toHaveStyle('display: none');
    expect(likes).toHaveStyle('display: none');
  });

  test('displays url and number of likes after view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} like={() => null} deleteBlog={null} />);

    const user = userEvent.setup();

    const viewButton=screen.getByText('view');
    await user.click(viewButton);

    const url = container.querySelector('.url');
    const likes = container.querySelector('.likes');

    expect(url).not.toHaveStyle('display: none');
    expect(likes).not.toHaveStyle('display: none');

  })

  test('two like button clicks result in two calls', async () => {
    const mockLikeHandler = jest.fn();
    const { container } = render(<Blog blog={blog} like={mockLikeHandler} deleteBlog={null} />);

    const user = userEvent.setup();

    const viewButton=screen.getByText('view');
    await user.click(viewButton);

    const likeButton=screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  })
});