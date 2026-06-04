
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'


const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: value => {
      set(() => ({ notification: value}))
      setTimeout(() => {
        set(() => ({ notification: null}))
    }, 5000)
    }
  }
}))

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, {...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
        .toSorted((a, b) => b.votes - a.votes)
      }))
    },
    add: anecdote => set(
      state => ({ anecdotes: state.anecdotes.concat(anecdote)})
    ),
    remove: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes: anecdotes.toSorted((a, b) => b.votes - a.votes) })
    }
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  //console.log(filter)
  if (filter === '') return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotifications = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useAnecdoteStore