import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Newblog from '../components/Newblog';
import userEvent from '@testing-library/user-event';

test('Blogform calls event handler with correct details when new blog created', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<Newblog addBlog={createBlog} />);

  const title = container.querySelector('#blogTitle');
  const author = container.querySelector('#author');
  const url = container.querySelector('#url');
  const sendButton = screen.getByText('create');

  await user.type(title, 'foo');
  await user.type(author, 'bar');
  await user.type(url, 'http://zombo.com/');
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('foo');
  expect(createBlog.mock.calls[0][0].author).toBe('bar');
  expect(createBlog.mock.calls[0][0].url).toBe('http://zombo.com/');
});