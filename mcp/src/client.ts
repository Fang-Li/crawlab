import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface CrawlabConfig {
  url: string;
  apiToken?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface Spider {
  _id: string;
  name: string;
  description?: string;
  cmd: string;
  param?: string;
  project_id?: string;
  type?: string;
  tags?: string[];
  created_ts?: Date;
  updated_ts?: Date;
}

export interface Task {
  _id: string;
  spider_id: string;
  spider_name?: string;
  cmd: string;
  param?: string;
  priority?: number;
  status: string;
  log_path?: string;
  result_count?: number;
  error?: string;
  start_ts?: Date;
  end_ts?: Date;
  created_ts?: Date;
  updated_ts?: Date;
}

export interface Node {
  _id: string;
  name: string;
  description?: string;
  ip: string;
  mac: string;
  hostname: string;
  status: string;
  is_master: boolean;
  created_ts?: Date;
  updated_ts?: Date;
}

export interface Schedule {
  _id: string;
  name: string;
  description?: string;
  spider_id: string;
  spider_name?: string;
  cron: string;
  cmd?: string;
  param?: string;
  enabled: boolean;
  created_ts?: Date;
  updated_ts?: Date;
}

export class CrawlabClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, apiToken?: string, timeout: number = 30000) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash

    this.client = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      error => {
        const message = error.response?.data?.error || error.message;
        throw new Error(`Crawlab API Error: ${message}`);
      }
    );
  }

  // Spiders
  async getSpiders(params?: PaginationParams): Promise<ApiResponse<Spider[]>> {
    const response = await this.client.get('/spiders', { params });
    return response.data;
  }

  async getSpider(id: string): Promise<ApiResponse<Spider>> {
    const response = await this.client.get(`/spiders/${id}`);
    return response.data;
  }

  async createSpider(spider: Partial<Spider>): Promise<ApiResponse<Spider>> {
    const response = await this.client.post('/spiders', spider);
    return response.data;
  }

  async updateSpider(
    id: string,
    spider: Partial<Spider>
  ): Promise<ApiResponse<Spider>> {
    const response = await this.client.put(`/spiders/${id}`, spider);
    return response.data;
  }

  async deleteSpider(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/spiders/${id}`);
    return response.data;
  }

  async runSpider(
    id: string,
    params?: {
      cmd?: string;
      param?: string;
      priority?: number;
    }
  ): Promise<ApiResponse<string[]>> {
    const response = await this.client.post(`/spiders/${id}/run`, params);
    return response.data;
  }

  async getSpiderFiles(id: string, path?: string): Promise<ApiResponse<any[]>> {
    const params = path ? { path } : {};
    const response = await this.client.get(`/spiders/${id}/files`, { params });
    return response.data;
  }

  async getSpiderFileContent(
    id: string,
    path: string
  ): Promise<ApiResponse<string>> {
    const response = await this.client.get(`/spiders/${id}/files/content`, {
      params: { path },
    });
    return response.data;
  }

  async saveSpiderFile(
    id: string,
    path: string,
    content: string
  ): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/spiders/${id}/files/save`, {
      path,
      content,
    });
    return response.data;
  }

  // Tasks
  async getTasks(
    params?: PaginationParams & { spider_id?: string; status?: string }
  ): Promise<ApiResponse<Task[]>> {
    const response = await this.client.get('/tasks', { params });
    return response.data;
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async cancelTask(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/tasks/${id}/cancel`);
    return response.data;
  }

  async restartTask(id: string): Promise<ApiResponse<string[]>> {
    const response = await this.client.post(`/tasks/${id}/restart`);
    return response.data;
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/tasks/${id}`);
    return response.data;
  }

  async getTaskLogs(
    id: string,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<string[]>> {
    const response = await this.client.get(`/tasks/${id}/logs`, { params });
    return response.data;
  }

  async getTaskResults(
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<any[]>> {
    const response = await this.client.get(`/tasks/${id}/results`, { params });
    return response.data;
  }

  // Nodes
  async getNodes(params?: PaginationParams): Promise<ApiResponse<Node[]>> {
    const response = await this.client.get('/nodes', { params });
    return response.data;
  }

  async getNode(id: string): Promise<ApiResponse<Node>> {
    const response = await this.client.get(`/nodes/${id}`);
    return response.data;
  }

  // Schedules
  async getSchedules(
    params?: PaginationParams
  ): Promise<ApiResponse<Schedule[]>> {
    const response = await this.client.get('/schedules', { params });
    return response.data;
  }

  async getSchedule(id: string): Promise<ApiResponse<Schedule>> {
    const response = await this.client.get(`/schedules/${id}`);
    return response.data;
  }

  async createSchedule(
    schedule: Partial<Schedule>
  ): Promise<ApiResponse<Schedule>> {
    const response = await this.client.post('/schedules', schedule);
    return response.data;
  }

  async updateSchedule(
    id: string,
    schedule: Partial<Schedule>
  ): Promise<ApiResponse<Schedule>> {
    const response = await this.client.put(`/schedules/${id}`, schedule);
    return response.data;
  }

  async deleteSchedule(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/schedules/${id}`);
    return response.data;
  }

  async enableSchedule(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/schedules/${id}/enable`);
    return response.data;
  }

  async disableSchedule(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/schedules/${id}/disable`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
