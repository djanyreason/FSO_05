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
    const { container } = render(<Blog blog={blog} likes={() => null} deleteBlog={null} />);

    const titleCheck = screen.getByText(blog.title, { exact: false });
    const authorCheck = screen.getByText(blog.author, { exact: false });

    expect(titleCheck).toBeDefined();
    expect(authorCheck).toBeDefined();
  });

  test('does not render url or number of likes at start', () => {
    const { container } = render(<Blog blog={blog} likes={() => null} deleteBlog={null} />);

    const url = container.querySelector('.url');
    const likes = container.querySelector('.likes');

    expect(url).toHaveStyle('display: none');
    expect(likes).toHaveStyle('display: none');
  });
});