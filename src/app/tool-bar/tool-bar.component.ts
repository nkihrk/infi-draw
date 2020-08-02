import { Component, OnInit } from '@angular/core';
import { faHandPaper } from '@fortawesome/free-regular-svg-icons';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  faHandPaper = faHandPaper;
  faPenNib = faPenNib;
  faEraser = faEraser;
  faSquare = faSquare;
  faCircle = faCircle;
  faFont = faFont;

  constructor() { }

  ngOnInit(): void {
  }

}
