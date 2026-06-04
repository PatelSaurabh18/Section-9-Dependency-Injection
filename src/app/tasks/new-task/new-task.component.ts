import { Component, ElementRef, Inject, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { TasksServiceToken } from '../../../main';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');

  /*
    private taskService :TasksService;
    constructor(tasksService : TasksService){
        this.taskService =  tasksService;
    }
  */

    constructor(@Inject(TasksServiceToken) private tasksService : TasksService){
    }
  

  // private tasksService  = inject(TasksServiceToken);

  /*
    This is the way of Dependency Injection, in this in each class no new instance will be created. We give this job to Angular so that it creates object that is shared across all classes and for each class no neew instance is craeated, rather shared instance is created across all classes
    -All 3 approaches mentioned above creates shared instance across all classes.
  */



  onAddTask(title: string, description: string) {
    this.tasksService.addTask({title,description});
    this.formEl()?.nativeElement.reset();
  }
}
