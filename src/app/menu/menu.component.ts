import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MemoryService } from '../shared/service/core/memory.service';

// Fontawesome
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	@ViewChildren('menuTitlesRef') menuTitlesRef: QueryList<ElementRef>;
	@ViewChildren('menuListsRef') menuListsRef: QueryList<ElementRef>;
	@ViewChildren('menuListTitlesRef') menuListTitlesRef: QueryList<ElementRef>;
	@ViewChildren('subMenuListsRef') subMenuListsRef: QueryList<ElementRef>;
	@ViewChildren('subMenuListTitlesRef') subMenuListTitlesRef: QueryList<ElementRef>;
	@ViewChildren('subSubMenuListsRef') subSubMenuListsRef: QueryList<ElementRef>;

	menuTitles: string[];
	menuLists: MenuList[][] = [];
	subMenuLists: MenuList[][];

	faPenNib = faPenNib;
	faUser = faUser;
	faCaretRight = faCaretRight;

	activeStickFlg = false;

	constructor(private memory: MemoryService) {
		this.menuTitles = ['ファイル', '編集', '変更', '表示', 'ヘルプ'];
		this.menuLists.push(this._file());
	}

	ngOnInit(): void {}

	initializeActiveStates(): void {
		this.toggleActiveSticks();
		this._removeAllActives();
	}

	toggleActiveSticks(): void {
		// Sync with other modules
		this.memory.states.isCanvasLocked = !this.memory.states.isCanvasLocked;
		// Apply to the local state
		this.activeStickFlg = this.memory.states.isCanvasLocked;
	}

	removeActives($type: string, $event: any): void {
		if ($type === 'menu') {
			const classList: any = $event.target.classList;
			if (classList.contains('menu-title')) {
				this._removeAllActives();
			}
		} else if ($type === 'menuList') {
			const classList: any = $event.target.classList;
			if (classList.contains('menu-list-title')) {
				this._removeActiveFromMenuLists();
				this._removeActiveFromSubMenuLists();
			}
		} else if ($type === 'subMenuList') {
			const classList: any = $event.target.classList;
			if (classList.contains('menu-list-title')) {
				this._removeActiveFromSubMenuLists();
			}
		}
	}

	private _removeAllActives(): void {
		this._removeActiveFromMenus();
		this._removeActiveFromMenuLists();
		this._removeActiveFromSubMenuLists();
	}

	private _removeActiveFromMenus(): void {
		const menuTitles: ElementRef<any>[] = this.menuTitlesRef.toArray();
		for (let i = 0; i < menuTitles.length; i++) {
			const menuTitle: HTMLElement = menuTitles[i].nativeElement;
			if (menuTitle.classList.contains('active')) menuTitle.classList.remove('active');
		}

		const menuLists: ElementRef<any>[] = this.menuListsRef.toArray();
		for (let i = 0; i < menuLists.length; i++) {
			const menuList: HTMLElement = menuLists[i].nativeElement;
			if (menuList.classList.contains('active')) menuList.classList.remove('active');
		}
	}

	private _removeActiveFromMenuLists(): void {
		const menuListTitles: ElementRef<any>[] = this.menuListTitlesRef.toArray();
		for (let i = 0; i < menuListTitles.length; i++) {
			const menuListTitle: HTMLElement = menuListTitles[i].nativeElement;
			if (menuListTitle.classList.contains('active')) menuListTitle.classList.remove('active');
		}

		const subMenuLists: ElementRef<any>[] = this.subMenuListsRef.toArray();
		for (let i = 0; i < subMenuLists.length; i++) {
			const subMenuList: HTMLElement = subMenuLists[i].nativeElement;
			if (subMenuList.classList.contains('active')) subMenuList.classList.remove('active');
		}
	}

	private _removeActiveFromSubMenuLists(): void {
		const subMenuListTitles: ElementRef<any>[] = this.subMenuListTitlesRef.toArray();
		for (let i = 0; i < subMenuListTitles.length; i++) {
			const subMenuListTitle: HTMLElement = subMenuListTitles[i].nativeElement;
			if (subMenuListTitle.classList.contains('active')) subMenuListTitle.classList.remove('active');
		}

		const subSubMenuLists: ElementRef<any>[] = this.subSubMenuListsRef.toArray();
		for (let i = 0; i < subSubMenuLists.length; i++) {
			const subSubMenuList: HTMLElement = subSubMenuLists[i].nativeElement;
			if (subSubMenuList.classList.contains('active')) subSubMenuList.classList.remove('active');
		}
	}

	private _file(): MenuList[] {
		const subMenuListInport: MenuList[] = [
			{
				title: '画像を挿入...',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '画像をリンク...',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'フォントを追加...',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const subMenuListExportPDF: MenuList[] = [
			{
				title: '72 dpi',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '96 dpi',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '150 dpi',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '300 dpi',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '詳細オプション...',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const subMenuListExport: MenuList[] = [
			{
				title: '高度なエクスポート...',
				key: 'Shift+Ctrl+E',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'PNG画像(.png)',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'JPEG画像(.jpg)',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'Scalable Vector Graphics(.svg)',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'PDFドキュメント(.pdf)',
				key: '',
				type: 1,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: subMenuListExportPDF
			}
		];

		const menuListFile: MenuList[] = [
			{
				title: 'バージョン履歴',
				key: '',
				type: 0,
				exec: () => {
					console.log('hi');

					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'インポート',
				key: '',
				type: 1,
				exec: () => {
					console.log('hi');

					this.initializeActiveStates();
				},
				subMenuList: subMenuListInport
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'エクスポート',
				key: '',
				type: 1,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: subMenuListExport
			},
			{
				title: '印刷...',
				key: 'Ctrl+P',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'ホームに戻る',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		return menuListFile;
	}
}

interface MenuList {
	title: string;
	key: string;
	type: number; // 0: menu-list, 1: sub-menu-list, 2: separator
	exec: Function;
	subMenuList: MenuList[];
}
