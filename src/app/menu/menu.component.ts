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

  onPointerUp($event: boolean): void {
    this._initMenus();
  }

  private _initMenus(): void {
    this.file.nativeElement.className = '';
    this.edit.nativeElement.className = '';
    this.modify.nativeElement.className = '';
    this.show.nativeElement.className = '';
    this.help.nativeElement.className = '';

    this._addMenuPrefixToMenu(this.file.nativeElement);
    this._addMenuPrefixToMenu(this.edit.nativeElement);
    this._addMenuPrefixToMenu(this.modify.nativeElement);
    this._addMenuPrefixToMenu(this.show.nativeElement);
    this._addMenuPrefixToMenu(this.help.nativeElement);
  }

  private _addMenuPrefixToMenu($target: HTMLDivElement): void {
    if (!$target.classList.contains('menu-prefix')) $target.classList.add('menu-prefix');
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

  onPointerHover($menuType: string): void {
    this._switchMenuToStick($menuType);
  }

  private _switchMenuToStick($targetName: string): void {
    switch ($targetName) {
      case 'file':
        const file: HTMLDivElement = this.file.nativeElement;
        if (file.classList.contains('active') && !file.classList.contains('active-stick')) {
          this._clearOtherActiveStick();
          this._addActiveStickToMenu(file);
        }
        break;

      case 'edit':
        const edit: HTMLDivElement = this.edit.nativeElement;
        if (edit.classList.contains('active') && !edit.classList.contains('active-stick')) {
          this._clearOtherActiveStick();
          this._addActiveStickToMenu(edit);
        }
        break;

      case 'modify':
        const modify: HTMLDivElement = this.modify.nativeElement;
        if (modify.classList.contains('active') && !modify.classList.contains('active-stick')) {
          this._clearOtherActiveStick();
          this._addActiveStickToMenu(modify);
        }
        break;

      case 'show':
        const show: HTMLDivElement = this.show.nativeElement;
        if (show.classList.contains('active') && !show.classList.contains('active-stick')) {
          this._clearOtherActiveStick();
          this._addActiveStickToMenu(show);
        }
        break;

      case 'help':
        const help: HTMLDivElement = this.help.nativeElement;
        if (help.classList.contains('active') && !help.classList.contains('active-stick')) {
          this._clearOtherActiveStick();
          this._addActiveStickToMenu(this.help.nativeElement);
        }
        break;
    }
  }

  private _clearOtherActiveStick(): void {
    this.file.nativeElement.classList.remove('active-stick');
    this.edit.nativeElement.classList.remove('active-stick');
    this.modify.nativeElement.classList.remove('active-stick');
    this.show.nativeElement.classList.remove('active-stick');
    this.help.nativeElement.classList.remove('active-stick');
  }

  private _addActiveStickToMenu($target: HTMLDivElement): void {
    if (!$target.classList.contains('active-stick')) $target.classList.add('active-stick');
  }
}

