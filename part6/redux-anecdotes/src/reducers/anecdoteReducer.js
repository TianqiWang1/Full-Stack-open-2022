import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'
import { setNotification } from "./notificationReducer"


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    addVote(state, action) {
      const updatedAnecdote = action.payload
      const {id} = updatedAnecdote 
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote: updatedAnecdote)
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const {addVote, appendAnecdote, setAnecdote} = anecdoteSlice.actions


export const initialAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setNotification(`new anecdoted created`,3))
  }
}

export const updateVote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(anecdote)
    dispatch(addVote(updatedAnecdote))
  }
}


export default anecdoteSlice.reducer