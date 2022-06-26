import { useDispatch, useSelector } from 'react-redux'
import { updateVote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div>
        <div> {anecdote.content} </div>
        <div> has {anecdote.votes} </div> 
        <button onClick={handleClick}> vote </button>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
   const anecdotes = useSelector(state => state.filter?
        state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
        :state.anecdotes)

  return(
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(updateVote(anecdote))
            dispatch(setNotification(`you voted '${anecdote.content}'`, 2))
            }
          }
        />
      )}
    </div>
  )
}

export default Anecdotes