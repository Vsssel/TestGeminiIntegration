import { create } from "zustand"
import { postMessage } from "../api"
import type { PostMessageRequest, PostMessageResponse } from "../api/type"

type Message = {
  from: 'ai' | 'user'
  message: string
}

type State = {
  messages: Message[]
}

type Action = {
  postMessage: (message: PostMessageRequest) => Promise<PostMessageResponse>,
  setMessage: (from: 'ai' | 'user', message: string) => void
}

export const useChat = create<State & Action>((set, get) => ({
  messages: [],
  postMessage: async (message) => {
    get().setMessage('user', message.message)
    const response = await postMessage(message)
    get().setMessage('ai', response.reply)
    return response
  },
  setMessage: (from, message) =>
    set((state) => ({
      messages: [...state.messages, { from, message }]
    }))
}))
