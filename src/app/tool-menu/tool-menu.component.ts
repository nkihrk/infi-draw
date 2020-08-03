import { Component, OnInit } from '@angular/core';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faQuidditch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {
  faSave = faSave;
  faUndo = faUndo;
  faRedo = faRedo;
  faQuidditch = faQuidditch;

  constructor() { }

  ngOnInit(): void {
  }
}
