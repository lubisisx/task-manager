import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = [
    'title',
    'dueDate',
    'priority',
    'completed',
    'actions',
  ];
  filterControl = new FormControl('');
  sortControl = new FormControl('dueDate');

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });

    this.filterControl.valueChanges.subscribe(() => this.applyFilter());
    this.sortControl.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter() {
    console.log('Filter changed!');
    let filteredTasks = this.taskService.getCurrentTasks();

    if (this.filterControl.value) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.includes(this.filterControl.value as string) ||
          task.description.includes(this.filterControl.value as string)
      );
    }

    if (this.sortControl.value === 'dueDate') {
      filteredTasks = filteredTasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    } else if (this.sortControl.value === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      filteredTasks = filteredTasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    this.tasks = filteredTasks;
  }

  markAsCompleted(task: Task) {
    task.completed = true;
    this.taskService.updateTask(task);
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
  }
}
