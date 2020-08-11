import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('file', {static: true}) file: ElementRef<HTMLDivElement>;
  @ViewChild('edit', {static: true}) edit: ElementRef<HTMLDivElement>;
  @ViewChild('modify', {static: true}) modify: ElementRef<HTMLDivElement>;
  @ViewChild('show', {static: true}) show: ElementRef<HTMLDivElement>;
  @ViewChild('help', {static: true}) help: ElementRef<HTMLDivElement>;

  faPenNib = faPenNib;
  faUser = faUser;
  faCaretRight = faCaretRight;

  ngOnInit(): void {
  }

  toggleActiveMenu(): void {
    this._addActiveToMenu(this.file.nativeElement);
    this._addActiveToMenu(this.edit.nativeElement);
    this._addActiveToMenu(this.modify.nativeElement);
    this._addActiveToMenu(this.show.nativeElement);
    this._addActiveToMenu(this.help.nativeElement);
  }

  private _addActiveToMenu($target: HTMLDivElement): void {
    if (!$target.classList.contains('active')) $target.classList.add('active');
  }
}
