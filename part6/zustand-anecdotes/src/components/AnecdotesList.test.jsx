import { describe, beforeEach, test, vi, expect, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import anecdoteService from '../services/anecdotes'
import AnecdoteStore from '../store'
import AnecdoteList from './AnecdoteList'

const mockAnecdotes = [
  {
    content: "Average anecdote",
    id: "1",
    votes: 4
  },
  {
    content: "Good anecdote",
    id: "2",
    votes: 6
  },
  {
    content: "Bad anecdote",
    id: "3",
    votes: 0
  }
]

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

describe('Shows anecdotes properly', () => {
  beforeEach(async () => {
    AnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    await act(async () => {
      await AnecdoteStore.getState().actions.initialize()
    })
  })

  test('in order', () => {
    render(<AnecdoteList />)

    const items = screen.getAllByTestId('anecdote-item')

    expect(items).toHaveLength(3)

    expect(items[0].textContent).toContain("Good anecdote")
    expect(items[1].textContent).toContain("Average anecdote")
    expect(items[2].textContent).toContain("Bad anecdote")
  })

  test('in order and filtered', async () => {
    AnecdoteStore.setState({ filter: 'Good' })

    render(<AnecdoteList />)

    const items = screen.getAllByTestId('anecdote-item')

    expect(items).toHaveLength(1)
    expect(items[0].textContent).toContain("Good anecdote")
  })

  afterEach(() => {
    cleanup()
  })
})
