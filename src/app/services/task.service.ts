import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();
  private taskIdCounter = 0;

  constructor() {}

  addTask(task: Task) {
    const tasks = this._tasks.getValue();
    task.id = this.taskIdCounter++;
    this._tasks.next([...tasks, task]);
  }

  updateTask(updatedTask: Task) {
    const tasks = this._tasks.getValue();
    const index = tasks.findIndex((task) => task.id === updatedTask.id);
    tasks[index] = updatedTask;
    this._tasks.next([...tasks]);
  }

  deleteTask(taskId: number) {
    const tasks = this._tasks.getValue();
    this._tasks.next(tasks.filter((task) => task.id !== taskId));
  }

  getCurrentTasks(): Task[] {
    return this._tasks.getValue();
  }
}
