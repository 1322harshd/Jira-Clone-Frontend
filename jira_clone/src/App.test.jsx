import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import App from './App'
import api from './api/axiosInstance.js'

// Fake the login state so the test doesn't need the real backend
vi.mock('./context/AuthContext.jsx', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({ currentUser: null, setCurrentUser: vi.fn(), authLoading: false }),
}))

// Fake the API so no real network calls are made
vi.mock('./api/axiosInstance.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

// Open the app at a given URL
const renderAt = (path) => {
  window.history.pushState({}, '', path)
  render(<App />)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Page loading', () => {
  test('login page loads', () => {
    renderAt('/login')
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  test('signup page loads', () => {
    renderAt('/signup')
    expect(screen.getByRole('heading', { name: 'SignUp' })).toBeInTheDocument()
  })

  test('logo is shown on login page', () => {
    renderAt('/login')
    expect(screen.getByAltText('website-logo')).toBeInTheDocument()
  })
})

describe('Navigation', () => {
  test('Sign Up button on login page opens signup page', () => {
    renderAt('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))
    expect(screen.getByRole('heading', { name: 'SignUp' })).toBeInTheDocument()
  })

  test('Login button on signup page opens login page', () => {
    renderAt('/signup')
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })
})

describe('Login form', () => {
  test('has email and password fields', () => {
    renderAt('/login')
    expect(screen.getByLabelText('Email:')).toBeInTheDocument()
    expect(screen.getByLabelText('Password:')).toBeInTheDocument()
  })

  test('typing updates the fields', () => {
    renderAt('/login')
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'secret123' } })
    expect(screen.getByLabelText('Email:')).toHaveValue('test@example.com')
    expect(screen.getByLabelText('Password:')).toHaveValue('secret123')
  })

  test('sends entered credentials to the API', () => {
    api.post.mockResolvedValueOnce({ data: { user: { id: 1, name: 'Test' } } })
    renderAt('/login')
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(api.post).toHaveBeenCalledWith('/login', { email: 'test@example.com', password: 'secret123' })
  })

  test('shows server error message when login fails', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } })
    renderAt('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  test('shows fallback error when server gives no message', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'))
    renderAt('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(await screen.findByText('Login failed')).toBeInTheDocument()
  })
})

describe('Signup form', () => {
  test('has name, email and password fields', () => {
    renderAt('/signup')
    expect(screen.getByLabelText('Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Email:')).toBeInTheDocument()
    expect(screen.getByLabelText('Password:')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument()
  })

  test('typing in name field updates it', () => {
    renderAt('/signup')
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Harsh' } })
    expect(screen.getByLabelText('Name:')).toHaveValue('Harsh')
  })
})
