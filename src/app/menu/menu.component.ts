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
				exec: () => {},
				subMenuList: subMenuListExportPDF
			}
		];

		const menuList: MenuList[] = [
			{
				title: '新規デザイン...',
				key: 'Alt+N',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'テンプレートから新規デザイン...',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'クリップボードから新規作成',
				key: 'Shift+Ctrl+Alt+N',
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
				title: 'ローカルファイルを開く...',
				key: 'Ctrl+O',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'Cloudから開く...',
				key: 'Shift+Ctrl+O',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '最近のファイルを開く',
				key: 'Ctrl+O',
				type: 1,
				exec: () => {},
				subMenuList: [
					{
						title: '最近開いたファイルはありません',
						key: '',
						type: 0,
						exec: () => {},
						subMenuList: []
					}
				]
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '保存',
				key: 'Ctrl+S',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'ファイルをダウンロード',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '名前を付けてCloudに保存...',
				key: 'Shift+Ctrl+S',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'バージョン履歴',
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
				title: 'インポート',
				key: '',
				type: 1,
				exec: () => {},
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
				exec: () => {},
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

		return menuList;
	}

	private _edit(): MenuList[] {
		const subMenuListPaste: MenuList[] = [
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
				title: '同じ位置に貼り付け',
				key: 'Shift+Ctrl+V',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '選択範囲内に貼り付け',
				key: 'Alt+Shift+Ctrl+V',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

		const menuList: MenuList[] = [
			{
				title: '元に戻す',
				key: 'Ctrl+Z',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: 'やり直す',
				key: 'Shift+Ctrl+Z',
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
				key: 'Shift+Ctrl+O',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListPaste
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
				title: '選択範囲の編集',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
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
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '設定...',
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
			},
			{
				title: '',
				key: '',
				type: 2,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '同じ幅',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '同じ長さ',
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
				title: '横方向に配置',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '縦方向に配置',
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
		const subMenuListZoom: MenuList[] = [
			{
				title: '6%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '12%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '25%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '50%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '66%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '100%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '150%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '200%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '300%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '400%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '800%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '1600%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '3200%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '6400%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '12800%',
				key: '',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '25600%',
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
				title: '拡大',
				key: 'Ctrl++',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			},
			{
				title: '縮小',
				key: 'Ctrl+-',
				type: 0,
				exec: () => {
					this.initializeActiveStates();
				},
				subMenuList: []
			}
		];

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
				title: 'レイヤーを画面に合わせる',
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
				title: '拡大 - 縮小',
				key: '',
				type: 1,
				exec: () => {},
				subMenuList: subMenuListZoom
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
