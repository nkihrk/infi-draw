import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { EventDirective } from './shared/directive/event.directive';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { ToolMenuComponent } from './tool-menu/tool-menu.component';
import { ActiveMenuDirective } from './shared/directive/active-menu.directive';
import { SlideBrushSizeDirective } from './shared/directive/slide-brush-size.directive';
import { StoreModule } from '@ngrx/store';
import { flgsReducer, flgsFeatureKey } from './reducers/flgs.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		CanvasComponent,
		EventDirective,
		ToolBarComponent,
		DashboardComponent,
		MenuComponent,
		ToolMenuComponent,
		ActiveMenuDirective,
		SlideBrushSizeDirective
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		StoreModule.forRoot({ [flgsFeatureKey]: flgsReducer }),
		!environment.production ? StoreDevtoolsModule.instrument() : []
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
