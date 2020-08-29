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
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-tool-bar',
	templateUrl: './tool-bar.component.html',
	styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
	@ViewChild('select', { static: true }) select: ElementRef<HTMLDivElement>;
	@ViewChild('hand', { static: true }) hand: ElementRef<HTMLDivElement>;
	@ViewChild('pen', { static: true }) pen: ElementRef<HTMLDivElement>;
	@ViewChild('eraser', { static: true }) eraser: ElementRef<HTMLDivElement>;
	@ViewChild('createSquare', { static: true }) createSquare: ElementRef<HTMLDivElement>;
	@ViewChild('createLine', { static: true }) createLine: ElementRef<HTMLDivElement>;
	@ViewChild('zoom', { static: true }) zoom: ElementRef<HTMLDivElement>;

	faMousePointer = faMousePointer;
	faHandPaper = faHandPaper;
	faPenNib = faPenNib;
	faEraser = faEraser;
	faSquare = faSquare;
	faZoom = faSearch;

	constructor(private memory: MemoryService, private func: FuncService) {}

	ngOnInit(): void {
		this.render();
	}

	execFunc($name: string): void {
		switch ($name) {
			case 'select':
				this.func.select();
				break;

			case 'hand':
				this.func.hand();
				break;

			case 'pen':
				this.func.pen();
				break;

			case 'eraser':
				this.func.eraser();
				break;

			case 'square':
				this.func.createSquare();
				break;

			case 'line':
				this.func.createLine();
				break;

			case 'zoom':
				this.func.zoom(true);
				break;

			default:
				break;
		}
	}

	render(): void {
		const r: FrameRequestCallback = () => {
			this._render();

			requestAnimationFrame(r);
		};
		requestAnimationFrame(r);
	}

	private _render(): void {
		const name: string = this.memory.reservedByFunc.current.name;
		let t: HTMLDivElement;

		switch (name) {
			case 'select':
				t = this.select.nativeElement;
				break;

			case 'hand':
				t = this.hand.nativeElement;
				break;

			case 'pen':
				t = this.pen.nativeElement;
				break;

			case 'eraser':
				t = this.eraser.nativeElement;
				break;

			case 'square':
				t = this.createSquare.nativeElement;
				break;

			case 'line':
				t = this.createLine.nativeElement;
				break;

			case 'zoom':
				t = this.zoom.nativeElement;
				break;

			default:
				this._resetToolBarClassAll();
				return;
				break;
		}

		// Toggle active
		this._toggleActive(t);
	}

	private _toggleActive($targetElem: HTMLDivElement): void {
		if ($targetElem.classList.contains('active')) return;

		this._resetToolBarClassAll();
		$targetElem.classList.add('active');
	}

	private _resetToolBarClassAll(): void {
		this._resetToolBarClass(this.select.nativeElement);
		this._resetToolBarClass(this.hand.nativeElement);
		this._resetToolBarClass(this.pen.nativeElement);
		this._resetToolBarClass(this.eraser.nativeElement);
		this._resetToolBarClass(this.createSquare.nativeElement);
		this._resetToolBarClass(this.createLine.nativeElement);
		this._resetToolBarClass(this.zoom.nativeElement);
	}

	private _resetToolBarClass($targetElem: HTMLDivElement): void {
		$targetElem.classList.remove('active');
	}
}
