import { Component, OnInit } from '@angular/core';
import { faHandPaper } from '@fortawesome/free-regular-svg-icons';
import { faMousePointer } from '@fortawesome/free-solid-svg-icons';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearchMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  faMousePointer = faMousePointer;
  faHandPaper = faHandPaper;
  faPenNib = faPenNib;
  faEraser = faEraser;
  faSquare = faSquare;
  faCircle = faCircle;
  faFont = faFont;
  faEyeDropper = faEyeDropper;
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;

  constructor() { }

  ngOnInit(): void {
  }

}
