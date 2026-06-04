import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'
import useNotification from './useNotify'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useNotification()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    select: (data) => data.toSorted((a, b) => b.votes - a.votes)
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      setNotification(`too short anecdote, must have length 5 or more`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
    addVote: (anecdote) => updateAnecdoteMutation.mutate({
      ...anecdote, votes: anecdote.votes + 1
    })
  }
}