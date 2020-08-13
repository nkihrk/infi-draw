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
  // Menu - file
  @ViewChild('file', { static: true }) file: ElementRef<HTMLDivElement>;
  @ViewChild('fileOpenRecent', { static: true }) fileOpenRecent: ElementRef<HTMLDivElement>;
  @ViewChild('fileInport', { static: true }) fileInport: ElementRef<HTMLDivElement>;
  @ViewChild('fileExport', { static: true }) fileExport: ElementRef<HTMLDivElement>;
  @ViewChild('fileExportPDF', { static: true }) fileExportPDF: ElementRef<HTMLDivElement>;

  // Menu - edit
  @ViewChild('edit', { static: true }) edit: ElementRef<HTMLDivElement>;

  // Menu - modify
  @ViewChild('modify', { static: true }) modify: ElementRef<HTMLDivElement>;

  // Menu - show
  @ViewChild('show', { static: true }) show: ElementRef<HTMLDivElement>;

  // Menu - help
  @ViewChild('help', { static: true }) help: ElementRef<HTMLDivElement>;

  toggleActiveMenuFlg = false;
  toggleActiveHoverOnMenuFlg = false;

  // Fontawesome
  faPenNib = faPenNib;
  faUser = faUser;
  faCaretRight = faCaretRight;

  constructor() {}

  ngOnInit(): void {}

  test(): void {
    console.log('hi');
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Utility
  //
  /////////////////////////////////////////////////////////////////

  // Add a class to the target element
  private _addClass2TargetElem($target: ElementRef<HTMLDivElement>, $class: string): void {
    if (!$target.nativeElement.classList.contains($class)) $target.nativeElement.classList.add($class);
  }

  // Clear a class from the target element
  private _clearClassFromTargetElem($target: ElementRef<HTMLElement>, $class: string): void {
    if ($target.nativeElement.classList.contains($class)) $target.nativeElement.classList.remove($class);
  }

  /////////////////////////////////////////////////////////////////
  //
  //  PointerUp event
  //
  /////////////////////////////////////////////////////////////////

  onPointerUp($event: boolean): void {
    if (!this.toggleActiveMenuFlg) {
      this._initMenus();
    }
  }

  // Initialize all classes from menu-related elements, and set default classes at the end
  private _initMenus(): void {
    this._clearAllClassesFromMenus();
    this._clearAllClassesFromMenuLists();
    this._clearAllClassesFromSubMenuLists();

    this._addMenuPrefixToMenus();
    this._addSubMenuListWrapperToMenuLists();
    this._addSubSubMenuListWrapperToMenuLists();
  }

  // Clear all classes from menu
  private _clearAllClassesFromMenus(): void {
    this.file.nativeElement.className = '';
    this.edit.nativeElement.className = '';
    this.modify.nativeElement.className = '';
    this.show.nativeElement.className = '';
    this.help.nativeElement.className = '';
  }

  // Clear all classes from menu list
  private _clearAllClassesFromMenuLists(): void {
    this.fileOpenRecent.nativeElement.className = '';
    this.fileInport.nativeElement.className = '';
    this.fileExport.nativeElement.className = '';
  }

  // Clear all classes from sub menu list
  private _clearAllClassesFromSubMenuLists(): void {
    this.fileExportPDF.nativeElement.className = '';
  }

  // Add menu-prefix to menu
  private _addMenuPrefixToMenus(): void {
    this._addClass2TargetElem(this.file, 'menu-prefix');
    this._addClass2TargetElem(this.edit, 'menu-prefix');
    this._addClass2TargetElem(this.modify, 'menu-prefix');
    this._addClass2TargetElem(this.show, 'menu-prefix');
    this._addClass2TargetElem(this.help, 'menu-prefix');
  }

  // Add sub-menu-list-wrapper to sub menu list
  private _addSubMenuListWrapperToMenuLists(): void {
    this._addClass2TargetElem(this.fileOpenRecent, 'sub-menu-list-wrapper');
    this._addClass2TargetElem(this.fileInport, 'sub-menu-list-wrapper');
    this._addClass2TargetElem(this.fileExport, 'sub-menu-list-wrapper');
  }

  // Add sub-sub-menu-list-wrapper to sub sub menu list
  private _addSubSubMenuListWrapperToMenuLists(): void {
    this._addClass2TargetElem(this.fileExportPDF, 'sub-sub-menu-list-wrapper');
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Toggle active of menus
  //
  /////////////////////////////////////////////////////////////////

  toggleActiveMenu(): void {
    this.toggleActiveMenuFlg = !this.toggleActiveMenuFlg;

    // Clean up if menu is closed
    if (!this.toggleActiveMenuFlg) this._initMenus();
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Pointer hover event
  //
  ////////////////////////////////////////////////////////////////

  onPointerHover($menuName: string, $menuType: string): void {
    if ($menuType === 'menu') {
      this._switchMenuToStick($menuName);
    } else if ($menuType === 'menuList') {
      this._switchMenuListToStick($menuName);
    } else if ($menuType === 'subMenuList') {
      this._switchSubMenuListToStick($menuName);
    }
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Switching menu
  //
  /////////////////////////////////////////////////////////////////

  private _switchMenuToStick($targetName: string): void {
    this._clearActiveHoverFromMenu();
    this._clearActiveStickFromMenu();

    switch ($targetName) {
      case 'file':
        const file: HTMLDivElement = this.file.nativeElement;
        if (file.classList.contains('active')) {
          this._addClass2TargetElem(this.file, 'active-stick');
        } else {
          this._addClass2TargetElem(this.file, 'active-hover');
        }
        break;

      case 'edit':
        const edit: HTMLDivElement = this.edit.nativeElement;
        if (edit.classList.contains('active')) {
          this._addClass2TargetElem(this.edit, 'active-stick');
        } else {
          this._addClass2TargetElem(this.edit, 'active-hover');
        }
        break;

      case 'modify':
        const modify: HTMLDivElement = this.modify.nativeElement;
        if (modify.classList.contains('active')) {
          this._addClass2TargetElem(this.modify, 'active-stick');
        } else {
          this._addClass2TargetElem(this.modify, 'active-hover');
        }
        break;

      case 'show':
        const show: HTMLDivElement = this.show.nativeElement;
        if (show.classList.contains('active')) {
          this._addClass2TargetElem(this.show, 'active-stick');
        } else {
          this._addClass2TargetElem(this.show, 'active-hover');
        }
        break;

      case 'help':
        const help: HTMLDivElement = this.help.nativeElement;
        if (help.classList.contains('active')) {
          this._addClass2TargetElem(this.help, 'active-stick');
        } else {
          this._addClass2TargetElem(this.help, 'active-hover');
        }
        break;

      default:
        break;
    }
  }

  // Clear active-hover from target elements
  private _clearActiveHoverFromMenu(): void {
    this._clearClassFromTargetElem(this.file, 'active-hover');
    this._clearClassFromTargetElem(this.edit, 'active-hover');
    this._clearClassFromTargetElem(this.modify, 'active-hover');
    this._clearClassFromTargetElem(this.show, 'active-hover');
    this._clearClassFromTargetElem(this.help, 'active-hover');
  }

  // Clear active-stick from target elements
  private _clearActiveStickFromMenu(): void {
    this._clearClassFromTargetElem(this.file, 'active-stick');
    this._clearClassFromTargetElem(this.edit, 'active-stick');
    this._clearClassFromTargetElem(this.modify, 'active-stick');
    this._clearClassFromTargetElem(this.show, 'active-stick');
    this._clearClassFromTargetElem(this.help, 'active-stick');
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Switching menu list
  //
  /////////////////////////////////////////////////////////////////

  private _switchMenuListToStick($targetName: string): void {
    this._clearActiveStickFromMenuList();

    switch ($targetName) {
      case 'fileOpenRecent':
        this._addClass2TargetElem(this.fileOpenRecent, 'active-stick');
        break;

      case 'fileInport':
        const fileInport: HTMLDivElement = this.fileInport.nativeElement;
        this._addClass2TargetElem(this.fileInport, 'active-stick');
        break;

      case 'fileExport':
        const fileExport: HTMLDivElement = this.fileExport.nativeElement;
        this._addClass2TargetElem(this.fileExport, 'active-stick');
        break;

      default:
        break;
    }
  }

  // Clear active-stick from target elements
  private _clearActiveStickFromMenuList(): void {
    this._clearClassFromTargetElem(this.fileOpenRecent, 'active-stick');
    this._clearClassFromTargetElem(this.fileInport, 'active-stick');
    this._clearClassFromTargetElem(this.fileExport, 'active-stick');
  }

  /////////////////////////////////////////////////////////////////
  //
  //  Switching sub menu list
  //
  /////////////////////////////////////////////////////////////////

  private _switchSubMenuListToStick($targetName: string): void {
    this._clearActiveStickFromSubMenuList();

    switch ($targetName) {
      case 'fileExportPDF':
        this._addClass2TargetElem(this.fileExportPDF, 'active-stick');
        break;

      default:
        break;
    }
  }

  // Clear active-stick from target elements
  private _clearActiveStickFromSubMenuList(): void {
    this._clearClassFromTargetElem(this.fileExportPDF, 'active-stick');
  }
}
