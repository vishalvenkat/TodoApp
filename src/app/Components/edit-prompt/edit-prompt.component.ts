import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-prompt',
  templateUrl: './edit-prompt.component.html',
  styleUrls: ['./edit-prompt.component.css']
})
export class EditPromptComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
