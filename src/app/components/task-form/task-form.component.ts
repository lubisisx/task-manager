import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['low', Validators.required],
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id']
      ? +this.route.snapshot.params['id']
      : null;
    if (this.taskId !== null) {
      const task = this.taskService
        .getCurrentTasks()
        .find((t) => t.id === this.taskId);
      if (task) {
        this.taskForm.patchValue(task);
      }
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }
    const task: Task = {
      ...this.taskForm.value,
      id: this.taskId !== null ? this.taskId : 0,
      completed:
        this.taskId !== null
          ? this.taskService.getCurrentTasks().find((t) => t.id === this.taskId)
              ?.completed || false
          : false,
    };
    if (this.taskId !== null) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.router.navigate(['/tasks']);
  }
}
