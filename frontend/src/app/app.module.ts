import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGService } from 'ng-inline-svg/lib/inline-svg.service';
import { DetsyStoreService } from './detsy-store.service';
import { AppRoutingModule } from './app-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { BloomButtonComponent } from './bloom-button/bloom-button.component';
import { BloomListenService } from './bloom-listen-service.service';
import { WaitingModeService } from './waiting-mode.service';
import { WaitingComponent } from './waiting/waiting.component';


@NgModule({
	declarations: [
		AppComponent,
		DetailsComponent,
		HeaderComponent,
		HomeComponent,
		PaymentComponent,
		BloomButtonComponent,
		WaitingComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		InlineSVGModule,
		HttpClientModule
	],
	providers: [InlineSVGService, DetsyStoreService, BloomListenService, WaitingModeService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
