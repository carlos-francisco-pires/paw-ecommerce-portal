import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { authInterceptor } from './core/auth-interceptor';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './auth/login/login';
import { Home } from './shop/home/home';
import { Register } from './auth/register/register';
import { ProductDetail } from './shop/product-detail/product-detail';
import { CartPage } from './shop/cart-page/cart-page';
import { Checkout } from './shop/checkout/checkout';
import { MyOrders } from './client-area/my-orders/my-orders';
import { ManageCategories } from './admin/manage-categories/manage-categories';
import { MatTableModule } from '@angular/material/table';
import { ManageProducts } from './admin/manage-products/manage-products';
import { ManageOrders } from './admin/manage-orders/manage-orders';
import { MyDeliveries } from './delivery/my-deliveries/my-deliveries';
import { ManageUsers } from './admin/manage-users/manage-users';
import { Navbar } from './shared/navbar/navbar';
import { ManageDeliveries } from './admin/manage-deliveries/manage-deliveries';
import { StoreSettings } from './admin/store-settings/store-settings';
import { ChangePassword } from './client-area/change-password/change-password';
import { DashboardAdmin } from './admin/dashboard-admin/dashboard-admin';
import { DashboardLoja } from './admin/dashboard-loja/dashboard-loja';
import { DashboardEstafeta } from './delivery/dashboard-estafeta/dashboard-estafeta';
import { DashboardCliente } from './client-area/dashboard-cliente/dashboard-cliente';
import { CompareProducts } from './shop/compare-products/compare-products';
import { Profile } from './client-area/profile/profile';

@NgModule({
  declarations: [
    App,
    Login,
    Home,
    Register,
    ProductDetail,
    CartPage,
    Checkout,
    MyOrders,
    ManageCategories,
    ManageProducts,
    ManageOrders,
    MyDeliveries,
    ManageUsers,
    Navbar,
    ManageDeliveries,
    StoreSettings,
    ChangePassword,
    DashboardAdmin,
    DashboardLoja,
    DashboardEstafeta,
    DashboardCliente,
    CompareProducts,
    Profile,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
