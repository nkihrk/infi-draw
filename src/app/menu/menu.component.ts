import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MemoryService } from '../shared/service/core/memory.service';
import { FuncService } from '../shared/service/core/func.service';

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

	constructor(private memory: MemoryService, private func: FuncService) {
		this.menuTitles = ['ファイル', '編集', '変更', '表示', 'ヘルプ'];
		this.menuLists.push(this._file());
		this.menuLists.push(this._edit());
		this.menuLists.push(this._modify());
		this.menuLists.push(this._show());
		this.menuLists.push(this._help());
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

			// To set actives to currentTarget after initializtions
			const children: HTMLCollection = $event.currentTarget.children;
			if (
				children.length === 2 &&
				!children[0].classList.contains('active') &&
				!children[1].classList.contains('active')
			) {
				children[0].classList.add('active');
				children[1].classList.add('active');
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
		const menuList: MenuList[] = [
			{
				title: 'なし',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		return menuList;
	}

	private _edit(): MenuList[] {
		const menuList: MenuList[] = [
			{
				title: '元に戻す',
				key: 'Ctrl+Z',
				type: 0,
				exec: () => {
					this.func.undo();
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'やり直す',
				key: 'Shift+Ctrl+Z',
				type: 0,
				exec: () => {
					this.func.redo();
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '切り取り',
				key: 'Ctrl+X',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'コピー',
				key: 'Ctrl+C',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '貼り付け',
				key: 'Ctrl+V',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '削除',
				key: 'Del',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '複製',
				key: 'Ctrl+D',
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
				title: 'すべて選択',
				key: 'Ctrl+A',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'すべて選択解除',
				key: 'Shift+Ctrl+A',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '選択範囲を反転',
				key: 'Shift+Ctrl+I',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		return menuList;
	}

	private _modify(): MenuList[] {
		const subMenuListOrder: MenuList[] = [
			{
				title: '最前面へ',
				key: 'Shift+Ctrl+上矢印',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '一つ前面へ',
				key: 'Ctrl+上矢印',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '一つ背面へ',
				key: 'Ctrl+下矢印',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '最背面へ',
				key: 'Shift+Ctrl+下矢印',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const subMenuListAlign: MenuList[] = [
			{
				title: '左揃え',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '横の中央揃え',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '右揃え',
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
				title: '上揃え',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '縦の中央揃え',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '下揃え',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const subMenuListTransform: MenuList[] = [
			{
				title: '左に45°回転',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '左に90°回転',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '左に180°回転',
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
				title: '右に45°回転',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '右に90°回転',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '右に180°回転',
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
				title: '垂直方向にミラー化',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '水平方向にミラー化',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const menuList: MenuList[] = [
			{
				title: '重ね順',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListOrder
			},
			{
				title: '配置',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListAlign
			},
			{
				title: '移動',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListTransform
			}
		];

		return menuList;
	}

	private _show(): MenuList[] {
		const menuList: MenuList[] = [
			{
				title: '元のビュー',
				key: 'Ctrl+O',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '選択範囲を画面に合わせる',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '全体を画面に合わせる',
				key: 'Alt+Ctrl+O',
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
				title: '拡大',
				key: 'Ctrl+Space+ドラッグ',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '縮小',
				key: 'Ctrl+Alt+Space+ドラッグ',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		return menuList;
	}

	private _help(): MenuList[] {
		const subMenuListSupport: MenuList[] = [
			{
				title: 'お問い合わせ',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '開発者に詳細を送信',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const subMenuListLang: MenuList[] = [
			{
				title: '日本語',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'English',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const menuList: MenuList[] = [
			{
				title: 'サポート',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListSupport
			},
			{
				title: '言語',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListLang
			},
			{
				title: '更新情報',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		return menuList;
	}
}

interface MenuList {
	title: string;
	key: string;
	type: number; // 0: menu-list, 1: sub-menu-list, 2: separator
	exec: Function;
	subMenuList: MenuList[];
}
