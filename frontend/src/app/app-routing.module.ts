import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'details/:itemId', component: DetailsComponent },
	{ path: 'payment/:itemId', component: PaymentComponent },
	{ path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}