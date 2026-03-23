import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

export interface StarredRepo {
  id: string
  github_user: string
  repo_id: number
  repo_name: string
  full_name: string
  description: string
  html_url: string
  star_num: number
  language: string
  fork_num: number
  tags: string
  created_at: string
  updated_at: string
  pushed_at: string
  collected_at: string
}

export interface SearchParams {
  github_user: string
  min_stars?: number
  max_stars?: number
  language?: string
  tag?: string
  page?: number
  perPage?: number
}

export interface SearchResult {
  page: number
  perPage: number
  items: StarredRepo[]
}

export interface LanguagesResponse {
  languages: Record<string, number>
}

export interface TagsResponse {
  tags: Record<string, number>
}

export const api = {
  async fetchStarredRepos(username: string): Promise<{ username: string; count: number; repos: any[] }> {
    const response = await axios.get(`${API_URL}/api/github/starred/${username}`)
    return response.data
  },

  async collectStarredRepos(username: string): Promise<{ username: string; fetched: number; saved: number; message: string }> {
    const response = await axios.post(`${API_URL}/api/github/collect/${username}`)
    return response.data
  },

  async searchStarredRepos(params: SearchParams): Promise<SearchResult> {
    const queryParams = new URLSearchParams()
    queryParams.append('github_user', params.github_user)
    
    if (params.min_stars !== undefined) queryParams.append('min_stars', params.min_stars.toString())
    if (params.max_stars !== undefined) queryParams.append('max_stars', params.max_stars.toString())
    if (params.language) queryParams.append('language', params.language)
    if (params.tag) queryParams.append('tag', params.tag)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.perPage) queryParams.append('perPage', params.perPage.toString())

    const response = await axios.get(`${API_URL}/api/starred/search?${queryParams.toString()}`)
    return response.data
  },

  async getLanguages(username: string): Promise<LanguagesResponse> {
    const response = await axios.get(`${API_URL}/api/starred/languages/${username}`)
    return response.data
  },

  async getTags(username: string): Promise<TagsResponse> {
    const response = await axios.get(`${API_URL}/api/starred/tags/${username}`)
    return response.data
  },
}
