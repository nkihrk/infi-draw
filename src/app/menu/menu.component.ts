import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
	@ViewChildren('elReference') elReference: QueryList<ElementRef>;

	menus: string[];
	menuLists: MenuList[][];
	subMenuLists: MenuList[][];

	faPenNib = faPenNib;
	faUser = faUser;
	faCaretRight = faCaretRight;

	constructor() {
		this.menus = ['ファイル'];
		this.menuLists = [];

		const subMenuListInport: MenuList[] = [
			{
				title: '画像を挿入...',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '画像をリンク...',
				key: '',
				type: 0,
				exec: () => {},
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
				exec: () => {},
				subMenuList: []
			}
		];

		const subMenuListExportPDF: MenuList[] = [
			{
				title: '72 dpi',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '96 dpi',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '150 dpi',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '300 dpi',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: '詳細オプション...',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			}
		];

		const subMenuListExport: MenuList[] = [
			{
				title: '高度なエクスポート...',
				key: 'Shift+Ctrl+E',
				type: 0,
				exec: () => {},
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
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'JPEG画像(.jpg)',
				key: '',
				type: 0,
				exec: () => {},
				subMenuList: []
			},
			{
				title: 'Scalable Vector Graphics(.svg)',
				key: '',
				type: 0,
				exec: () => {},
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

		const menuListFile: MenuList[] = [
			{
				title: 'バージョン履歴',
				key: '',
				type: 0,
				exec: () => {
					console.log('hi');
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
				exec: () => {},
				subMenuList: subMenuListExport
			},
			{
				title: '印刷...',
				key: 'Ctrl+P',
				type: 0,
				exec: () => {},
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
				exec: () => {},
				subMenuList: []
			}
		];
		this.menuLists.push(menuListFile);
	}

	ngOnInit(): void {}

	ngAfterViewInit() {
		console.log(this.elReference.toArray());
	}
}

interface MenuList {
	title: string;
	key: string;
	type: number; // 0: menu-list, 1: sub-menu-list, 2: separator
	exec: Function;
	subMenuList: MenuList[];
}
