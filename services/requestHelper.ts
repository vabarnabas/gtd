import { Folder, Task, User } from "../types/prisma.types"
import { makeRequest } from "./makeRequest"
import TokenService from "./token.service"

export type Route = "users" | "tasks" | "folders"

export type RequestTypes = User | Task | Folder

export interface Token {
  access_token: string
}

export const requestHelper = {
  async getToken(): Promise<string> {
    const tokenservice = new TokenService()

    return await tokenservice.getToken()
  },
  async getAll<T extends RequestTypes>(route: Route): Promise<T[]> {
    const response = await makeRequest("GET", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: route,
      token: await this.getToken(),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
  async getSpecific<T extends RequestTypes>(
    route: Route,
    id: string
  ): Promise<T> {
    const response = await makeRequest("GET", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: `${route}/${id}`,
      token: await this.getToken(),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
  async create<T extends RequestTypes>(
    route: Route,
    input: Omit<T, "id">
  ): Promise<T> {
    const response = await makeRequest("POST", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: route,
      token: await this.getToken(),
      body: JSON.stringify(input),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
  async update<T extends RequestTypes>(
    route: Route,
    input: Partial<Omit<T, "id">>,
    id: string
  ): Promise<T> {
    const response = await makeRequest("PATCH", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: `${route}/${id}`,
      token: await this.getToken(),
      body: JSON.stringify(input),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
  async delete<T extends RequestTypes>(route: Route, id: string): Promise<T> {
    const response = await makeRequest("DELETE", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: `${route}/${id}`,
      token: await this.getToken(),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
  async login(identifier: string, password: string): Promise<Token> {
    const response = await makeRequest("POST", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: "auth/local/signin",
      body: JSON.stringify({ identifier, password }),
    })

    if (response?.statusCode) throw new Error()

    return response
  },
}
