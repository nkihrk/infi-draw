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
import { MenuDirective } from './shared/directive/menu.directive';

@NgModule({
  declarations: [AppComponent, CanvasComponent, EventDirective, ToolBarComponent, DashboardComponent, MenuComponent, ToolMenuComponent, MenuDirective],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
