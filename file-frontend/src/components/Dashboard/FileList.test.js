// src/components/Dashboard/FileList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileList from './FileList';
import api from '../../api';

// Mock the API calls
jest.mock('../../api', () => ({
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

const mockFiles = ['file1.txt', 'file2.txt'];

describe('FileList Component', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockFiles });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the file list', async () => {
    await act(async () => {
      render(<FileList />);
    });

    await waitFor(() => {
      expect(screen.getByText('file1.txt')).toBeInTheDocument();
      expect(screen.getByText('file2.txt')).toBeInTheDocument();
    });
  });

  it('should delete a file', async () => {
    api.delete.mockResolvedValue({});
    await act(async () => {
      render(<FileList />);
    });

    await waitFor(() => screen.getByText('file1.txt'));

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/files/file1.txt');
      expect(api.get).toHaveBeenCalledTimes(2); // Initial fetch and after delete
    });
  });

  it('should rename a file', async () => {
    api.put.mockResolvedValue({});
    await act(async () => {
      render(<FileList />);
    });

    await waitFor(() => screen.getByText('file1.txt'));

    fireEvent.click(screen.getAllByText('Rename')[0]);
    fireEvent.change(screen.getByPlaceholderText('New name'), { target: { value: 'newfile1.txt' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/files/file1.txt', { newName: 'newfile1.txt' });
      expect(api.get).toHaveBeenCalledTimes(2); // Initial fetch and after rename
    });
  });

  it('should download a file', async () => {

    await act(async () => {
        render(<FileList />);
      });
  
    await waitFor(() => screen.getByText('file1.txt'));

    const signedUrl = 'http://signed-url.com/file1.txt';
    const blob = new Blob(['file content'], { type: 'text/plain' });
    api.get.mockImplementation((url) => {
      if (url === '/files/signed-url/file1.txt') {
        return Promise.resolve({ data: { url: signedUrl } });
      } else if (url === signedUrl) {
        return Promise.resolve({ data: blob });
      }
    });

    fireEvent.click(screen.getAllByText('Download')[0]);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/files/signed-url/file1.txt');
      expect(api.get).toHaveBeenCalledWith(signedUrl, { responseType: 'blob' });
    });
  });
});