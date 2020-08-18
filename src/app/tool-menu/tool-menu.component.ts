import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuncService } from '../shared/service/core/func.service';

// Fontawesome
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faQuidditch } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-tool-menu',
	templateUrl: './tool-menu.component.html',
	styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {
	@ViewChild('brushSizeMeter', { static: true }) brushSizeMeterRef: ElementRef<HTMLDivElement>;

	// Fontawesome
	faSave = faSave;
	faUndo = faUndo;
	faRedo = faRedo;
	faQuidditch = faQuidditch;

	// Brush size
	brushSize = 1;

	constructor(private func: FuncService) {}

	ngOnInit(): void {}

	save(): void {
		this.func.save();
	}

	undo(): void {
		this.func.undo();
	}

	redo(): void {
		this.func.redo();
	}

	cleanUp(): void {
		this.func.cleanUp();
	}

	slideBrushSize(): void {
		this.func.slideBrushSize();
	}
}
