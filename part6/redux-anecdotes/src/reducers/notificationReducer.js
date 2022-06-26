import { createSlice } from "@reduxjs/toolkit"


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        set(state, action) {
            return action.payload
        },
        clear(state, action) {
            return ''
        }
    }
})
  
export const {set, clear} = notificationSlice.actions

let timeoutId = null

export const setNotification = (message, delay) => {
    return async (dispatch) => {
        dispatch(set(message))
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        
        timeoutId = setTimeout(()=>
            dispatch(clear())
            , delay*1000)
    }
}

export default notificationSlice.reducer