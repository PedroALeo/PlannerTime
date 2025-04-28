import { LoginBody, SignUpBody } from '@/interfaces/auth'
import { Restriction, RestrictionRequest } from '@/interfaces/restriction'
import { EventRequest, Schedule } from '@/interfaces/schedule'
import { CreateTask, Task } from '@/interfaces/tasks'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/' }),
  tagTypes: ['Planner'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<string, LoginBody>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
    // Criar usuário
    signUp: builder.mutation<string, SignUpBody>({
      query: (body) => ({
        url: 'createUser',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Planner'],
    }),
    // Criar evento
    createEvent: builder.mutation<
      string,
      { username: string; params: EventRequest }
    >({
      query: ({ username, params }) => ({
        url: `createEvent?username=${username}`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Planner'],
    }),
    // Atualizar evento
    updateEvent: builder.mutation<string, EventRequest>({
      query: (body) => ({
        url: 'updateEvent',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Planner'],
    }),
    // Deletar evento
    deleteEvent: builder.mutation<string, number>({
      query: (eventId) => ({
        url: `deleteEvent/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Planner'],
    }),
    // Buscar agenda do usuário
    userScheduller: builder.query<Schedule, { username: string }>({
      query: ({ username }) => ({
        url: `userScheduller/${username}`,
        method: 'GET',
      }),
      providesTags: ['Planner'],
    }),
    // Criar restrição
    createRestriction: builder.mutation<
      string,
      { email: string; data: RestrictionRequest }
    >({
      query: ({ email, data }) => ({
        url: `createRestriction/${email}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Planner'],
    }),
    // Buscar restrições do usuário
    getRestrictions: builder.query<Restriction[], { email: string }>({
      query: ({ email }) => ({
        url: `getRestrictions/${email}`,
        method: 'GET',
      }),
      providesTags: ['Planner'],
    }),
    // Criar tarefa
    createTask: builder.mutation<string, { email: string; task: CreateTask }>({
      query: ({ email, task }) => ({
        url: `createTask/${email}`,
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Planner'],
    }),
    // Buscar tarefas do usuário
    getTasks: builder.query<Task[], { email: string }>({
      query: ({ email }) => ({
        url: `getTasks/${email}`,
        method: 'GET',
      }),
      providesTags: ['Planner'],
    }),
    // Deletar tarefa
    deleteTask: builder.mutation<string, { email: string; taskId: number }>({
      query: ({ email, taskId }) => ({
        url: `deleteTask/${email}/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Planner'],
    }),
    // Deletar restrição
    deleteRestriction: builder.mutation<
      string,
      { email: string; restrictionId: number }
    >({
      query: ({ email, restrictionId }) => ({
        url: `deleteRestrictions/${email}/${restrictionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Planner'],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignUpMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUserSchedullerQuery,
  useCreateRestrictionMutation,
  useGetRestrictionsQuery,
  useCreateTaskMutation,
  useGetTasksQuery,
  useDeleteTaskMutation,
  useDeleteRestrictionMutation,
} = apiSlice
