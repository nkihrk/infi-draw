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
	//@ViewChild('file', { static: true }) file: ElementRef<HTMLDivElement>;

	faPenNib = faPenNib;
	faUser = faUser;
	faCaretRight = faCaretRight;

	ngOnInit(): void {}
}
