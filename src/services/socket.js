import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  'http://localhost:3000'

const socket = io(SOCKET_URL, {
  autoConnect: false,
})

let activeToken = null

export const connectSocket = (token) => {
  if (!token) return

  if (
    socket.connected &&
    activeToken !== token
  ) {
    socket.disconnect()
  }

  socket.auth = {
    token,
  }

  activeToken = token

  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  activeToken = null
  socket.auth = {}

  if (socket.connected) {
    socket.disconnect()
  }
}

export default socket
