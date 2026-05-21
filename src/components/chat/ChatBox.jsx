import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Send,
  Trash2,
  X,
} from 'lucide-react'

import toast from 'react-hot-toast'

import socket, {
  connectSocket,
} from '../../services/socket'

import useAuthStore from '../../store/authStore'

import {
  getMessages,
} from '../../services/messageService'

const getMessageUserId = (value) => {
  if (!value) return ''

  return typeof value === 'string'
    ? value
    : value._id
}

const belongsToChat = (
  message,
  currentUserId,
  selectedUserId
) => {
  const sender = getMessageUserId(
    message.sender
  )
  const receiver = getMessageUserId(
    message.receiver
  )

  return (
    (sender === currentUserId &&
      receiver === selectedUserId) ||
    (sender === selectedUserId &&
      receiver === currentUserId)
  )
}

function ChatBox({
  selectedUser,
  onClose,
}) {
  const { user, token } =
    useAuthStore()

  const [messages, setMessages] =
    useState([])

  const [text, setText] =
    useState('')

  const messagesEndRef =
    useRef(null)

  useEffect(() => {
    if (
      !user?._id ||
      !selectedUser?._id
    ) {
      return
    }

    let ignore = false
    const selectedUserId =
      selectedUser._id

    setMessages([])

    const fetchMessages =
      async () => {
        try {
          const data =
            await getMessages(
              selectedUser._id
            )

          if (ignore) return

          setMessages(
            data.filter((message) =>
              belongsToChat(
                message,
                user._id,
                selectedUserId
              )
            )
          )
        } catch (error) {
          if (ignore) return

          setMessages([])
        }
      }

    fetchMessages()

    return () => {
      ignore = true
    }
  }, [selectedUser?._id, user?._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: 'end',
    })
  }, [messages])

  useEffect(() => {
    if (
      !user?._id ||
      !selectedUser?._id ||
      !token
    ) {
      return
    }

    connectSocket(token)

    const selectedUserId =
      selectedUser._id

    const appendMessage =
      (message) => {
        if (
          !belongsToChat(
            message,
            user._id,
            selectedUserId
          )
        ) {
          return
        }

        setMessages((prev) => {
          if (
            prev.some(
              (item) =>
                item._id === message._id
            )
          ) {
            return prev
          }

          return [...prev, message]
        })
      }

    const handleMessageError =
      (error) => {
        toast.error(
          error?.message ||
            'No se pudo enviar'
        )
      }

    const handleMessageDeleted =
      ({ messageId }) => {
        setMessages((prev) =>
          prev.filter(
            (message) =>
              message._id !== messageId
          )
        )
      }

    socket.on(
      'newMessage',
      appendMessage
    )

    socket.on(
      'messageSent',
      appendMessage
    )

    socket.on(
      'messageError',
      handleMessageError
    )

    socket.on(
      'messageDeleted',
      handleMessageDeleted
    )

    return () => {
      socket.off(
        'newMessage',
        appendMessage
      )
      socket.off(
        'messageSent',
        appendMessage
      )
      socket.off(
        'messageError',
        handleMessageError
      )
      socket.off(
        'messageDeleted',
        handleMessageDeleted
      )
    }
  }, [
    selectedUser?._id,
    token,
    user?._id,
  ])

  const sendMessage = (event) => {
    event.preventDefault()

    if (!text.trim()) return

    socket.emit('sendMessage', {
      receiver:
        selectedUser._id,

      text: text.trim(),
    })

    setText('')
  }

  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', {
      messageId,
    })
  }

  return (
    <div className='flex h-[min(620px,calc(100vh-8rem))] min-h-[460px] min-w-0 flex-col rounded-lg border border-white/10 bg-[#10151f]'>
      <div className='flex items-start justify-between gap-4 border-b border-white/10 p-5'>
        <div className='min-w-0'>
          <h2 className='font-bold text-white'>
            {
              selectedUser.username
            }
          </h2>
          <p className='break-all text-xs text-slate-500'>
            {selectedUser._id}
          </p>
        </div>

        {onClose && (
          <button
            type='button'
            onClick={onClose}
            className='grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400/60 hover:text-red-200'
            aria-label='Cerrar chat'
          >
            <X size={17} />
          </button>
        )}
      </div>

      <div className='stack-xs flex-1 overflow-y-auto p-5'>
        {messages.length === 0 ? (
          <p className='pt-24 text-center text-sm text-slate-500'>
            Sin mensajes.
          </p>
        ) : (
          messages.map(
            (message) => {
              const mine =
                getMessageUserId(
                  message.sender
                ) === user._id

              return (
                <div
                  key={message._id}
                  className={`group relative max-w-[82%] break-words rounded-lg px-4 py-3 pr-10 text-sm leading-6 ${
                    mine
                      ? 'ml-auto bg-violet-600 text-white'
                      : 'bg-white/10 text-slate-100'
                  }`}
                >
                  {message.text}

                  {mine && (
                    <button
                      type='button'
                      onClick={() =>
                        deleteMessage(
                          message._id
                        )
                      }
                      className='absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md text-white/70 opacity-100 transition hover:bg-white/15 hover:text-white sm:opacity-0 sm:group-hover:opacity-100'
                      aria-label='Borrar mensaje'
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )
            }
          )
        )}
        <div
          ref={messagesEndRef}
        />
      </div>

      <form
        onSubmit={sendMessage}
        className='flex gap-3 border-t border-white/10 p-4'
      >
        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder='Mensaje...'
          className='h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
        />

        <button
          type='submit'
          className='inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-500'
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
