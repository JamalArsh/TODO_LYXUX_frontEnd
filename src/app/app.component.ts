import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './services/data.service';

interface task {
  title: string;
  description: string;
  isCompleted: boolean;
  _id: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzButtonModule,
    NzIconModule,
    NzCollapseModule,
    NzAlertModule,
    NzModalModule,
    NzGridModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzNotificationModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  customStyle = {
    // 'margin-bottom': '24px',
    'background-color': '#A6FF96',
  };

  customStyle2 = {
    // 'margin-bottom': '24px',
  };

  tasks: task[] = [];

  constructor(
    private modalService: NzModalService,
    private nzMessageService: NzMessageService,
    private dataService: DataService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.dataService.getAllTasks().subscribe({
      next: (response) => {
        // console.log(response);
        this.tasks = response;
        console.log('====================================');
        console.log(this.tasks);
        console.log('====================================');
      },
      error: (error) => {
        this.notification.create('Error', 'Error', 'Unable to get data');
      },
    });
  }

  addNewTask() {
    const modal: NzModalRef = this.modalService.create({
      nzContent: AddNewTaskComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzCentered: true,
    });

    modal.componentInstance.modalType = 'new';

    modal.afterClose.subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }

  editTask(
    title: string,
    description: string,
    isCompleted: boolean,
    _id: string
  ) {
    console.log('Edit task function\n' + title + '\n' + description);
    const modal: NzModalRef = this.modalService.create({
      nzContent: AddNewTaskComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzCentered: true,
    });

    modal.componentInstance.modalType = 'edit';
    modal.componentInstance.title = title;
    modal.componentInstance.description = description;
    modal.componentInstance.isCompleted = isCompleted;
    modal.componentInstance._id = _id;

    modal.afterClose.subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }

  cancel(): void {
    this.nzMessageService.info('Delete canceled');
  }

  confirm({ _id }: task): void {
    console.log('====================================');
    console.log(_id);
    console.log('====================================');
    this.dataService.deleteTask({ _id }).subscribe({
      next: (res) => {
        this.notification.success('Success', 'Task deleted successfully');
        this.ngOnInit();
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to delete task');
        this.ngOnInit();
      },
    });
  }

  markAsCompleted(task: task) {
    let body: task = {
      ...task,
      isCompleted: true,
    };

    this.dataService.updateTask(body).subscribe({
      next: (res) => {
        this.notification.success('Success', 'Task updated successfully');
        this.ngOnInit();
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to update task');
        this.ngOnInit();
      },
    });
  }

  markAsNotCompleted(task: task) {
    let body: task = {
      ...task,
      isCompleted: false,
    };

    this.dataService.updateTask(body).subscribe({
      next: (res) => {
        this.notification.success('Success', 'Task updated successfully');
        this.ngOnInit();
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to update task');
        this.ngOnInit();
      },
    });
  }
}
