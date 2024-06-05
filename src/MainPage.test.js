import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from './MainPage';
import { useDropzone } from 'react-dropzone';
import { getDocument } from 'pdfjs-dist';
import * as XLSX from 'xlsx';

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn(),
  GlobalWorkerOptions: {
    workerSrc: ''
  },
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('MainPage', () => {
  beforeEach(() => {
    useDropzone.mockImplementation(({ onDrop }) => ({
      getRootProps: () => ({ onClick: () => {} }),
      getInputProps: () => ({}),
    }));

    getDocument.mockResolvedValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: jest.fn().mockResolvedValue({
          getTextContent: jest.fn().mockResolvedValue({
            items: [{ str: 'Test text for PDF' }],
          }),
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders MainPage component', () => {
    render(<MainPage />, { wrapper: MemoryRouter });
    expect(screen.getByText('powerFUL searching.')).toBeInTheDocument();
  });

  test('handles file drop and loading state', async () => {
    render(<MainPage />, { wrapper: MemoryRouter });
    const dropzone = screen.getByText(/drag and drop pdf files here/i);

    fireEvent.click(dropzone);

    await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Loading complete')).toBeInTheDocument());
  });

  test('handles keyword search and Excel download', async () => {
    render(<MainPage />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText('Enter keywords');
    const button = screen.getByText('search');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => expect(XLSX.writeFile).toHaveBeenCalled());
  });
});