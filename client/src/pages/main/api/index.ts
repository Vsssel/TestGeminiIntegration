import { AxiosError, type AxiosResponse } from "axios";
import api from "../../../shared/api"
import type { PostMessageRequest, PostMessageResponse } from "./type";

export async function postMessage(request: PostMessageRequest): Promise<PostMessageResponse>{
  try{
    const response = await api.post<PostMessageResponse>('/chat', request)

    return response.data
  }catch(error){
    if(error instanceof AxiosError && error.response?.data){
      return error.response.data
    }
  }throw new Error('Network Error! Please try again.')
}