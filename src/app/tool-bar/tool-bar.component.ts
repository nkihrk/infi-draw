import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MemoryService } from '../shared/service/core/memory.service';
import { FuncService } from '../shared/service/core/func.service';

// Fontawesome
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
  @ViewChild('select', {static: true}) select: ElementRef<HTMLDivElement>;
  @ViewChild('hand', {static: true}) hand: ElementRef<HTMLDivElement>;
  @ViewChild('draw', {static: true}) draw: ElementRef<HTMLDivElement>;
  @ViewChild('erase', {static: true}) erase: ElementRef<HTMLDivElement>;
  @ViewChild('createSquare', {static: true}) createSquare: ElementRef<HTMLDivElement>;
  @ViewChild('createCircle', {static: true}) createCircle: ElementRef<HTMLDivElement>;
  @ViewChild('createLine', {static: true}) createLine: ElementRef<HTMLDivElement>;
  @ViewChild('font', {static: true}) font: ElementRef<HTMLDivElement>;
  @ViewChild('colorPicker', {static: true}) colorPicker: ElementRef<HTMLDivElement>;
  @ViewChild('zoomIn', {static: true}) zoomIn: ElementRef<HTMLDivElement>;
  @ViewChild('zoomOut', {static: true}) zoomOut: ElementRef<HTMLDivElement>;

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

  constructor(private memory: MemoryService, private func: FuncService) { }

  ngOnInit(): void {
    this.render();
  }

  render(): void {
    const r: FrameRequestCallback = () => {
      this._render();

      requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
  }

  _render(): void {
    const name: string = this.memory.reservedByFunc.name;
    let t: HTMLDivElement;

    switch (name) {
      case 'select':
        t = this.select.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'hand':
        t = this.hand.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
          t.classList.add('active');
        }
        break;

      case 'draw':
        t = this.draw.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
          t.classList.add('active');
        }
        break;

      case 'erase':
        t = this.erase.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
          t.classList.add('active');
        }
        break;

      case 'createSquare':
        t = this.createSquare.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'createCircle':
        t = this.createCircle.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'createLine':
        t = this.createLine.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'font':
        t = this.font.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'colorPicker':
        t = this.colorPicker.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'zoomIn':
        t = this.zoomIn.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      case 'zoomOut':
        t = this.zoomOut.nativeElement;
        if (!t.classList.contains('active')) {
          this._resetToolBarClassAll();
        }
        break;

      default:
        break;
    }
  }

  private _resetToolBarClassAll(): void {
    this._resetToolBarClass(this.select.nativeElement);
    this._resetToolBarClass(this.hand.nativeElement);
    this._resetToolBarClass(this.draw.nativeElement);
    this._resetToolBarClass(this.erase.nativeElement);
    this._resetToolBarClass(this.createSquare.nativeElement);
    this._resetToolBarClass(this.createCircle.nativeElement);
    this._resetToolBarClass(this.createLine.nativeElement);
    this._resetToolBarClass(this.font.nativeElement);
    this._resetToolBarClass(this.colorPicker.nativeElement);
    this._resetToolBarClass(this.zoomIn.nativeElement);
    this._resetToolBarClass(this.zoomOut.nativeElement);
  }

  private _resetToolBarClass($targetElem: HTMLDivElement): void {
    $targetElem.className = '';
    $targetElem.classList.add('icon-prefix');
    $targetElem.classList.add('name-info-wrapper');
  }
}
