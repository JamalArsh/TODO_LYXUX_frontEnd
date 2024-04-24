import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { DataService } from '../services/data.service';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzNotificationModule,
    NzModalModule,
  ],
  templateUrl: './add-new-task.component.html',
  styleUrl: './add-new-task.component.sass',
})
export class AddNewTaskComponent implements OnInit {
  form!: FormGroup;
  isAddNew = true;
  @Input() modalType: any = '';
  @Input() title: any = '';
  @Input() description: any = '';
  @Input() isCompleted: any = '';
  @Input() _id: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.maxLength(200)],
    });

    if (this.modalType === 'new') {
      this.isAddNew = true;
      this.title = '';
      this.description = '';
      this.isCompleted = false;
    } else if (this.modalType === 'edit') {
      this.isAddNew = false;
      this.form.patchValue({
        title: this.title,
        description: this.description,
        isCompleted: this.isCompleted,
        _id: this._id,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.isAddNew) {
        let body = {
          title: this?.form?.get('title')?.value,
          description: this?.form?.get('description')?.value,
          isCompleted: this.isCompleted,
          _id: this._id,
        };

        console.log('+++++++++++++++++++++++++++\nthis is body');
        console.log(body);

        this.dataService.addNewTask(body).subscribe({
          next: (res) => {
            this.notification.success('Success', 'Task added successfully');
            this.modalService.closeAll();
          },
          error: (error) => {
            this.notification.error('Error', 'Failed to add task');
          },
        });
      } else {
        let body = {
          title: this?.form?.get('title')?.value,
          description: this?.form?.get('description')?.value,
          isCompleted: this.isCompleted,
          _id: this._id,
        };

        this.dataService.updateTask(body).subscribe({
          next: (res) => {
            this.notification.success('Success', 'Task updated successfully');
          },
          error: (error) => {
            this.notification.error('Error', 'Failed to update task');
          },
        });
      }
    } else {
      Object.values(this.form.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
