import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { AppRoutingModule } from './contract_interfaces/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGService } from 'ng-inline-svg/lib/inline-svg.service';
import { BloomButtonComponent } from './bloom-button/bloom-button.component';


@NgModule({
	declarations: [
		AppComponent,
		DetailsComponent,
		HeaderComponent,
		HomeComponent,
		BloomButtonComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		InlineSVGModule,
		HttpClientModule
	],
	providers: [InlineSVGService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
