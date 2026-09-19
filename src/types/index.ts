export type Priority = 'High' | 'Medium' | 'Low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}
