import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './shop/home/home';
import { authGuard } from './core/auth-guard';
import { ProductDetail } from './shop/product-detail/product-detail';
import { CartPage } from './shop/cart-page/cart-page';
import { Checkout } from './shop/checkout/checkout';
import { MyOrders } from './client-area/my-orders/my-orders';
import { ManageCategories } from './admin/manage-categories/manage-categories';
import { roleGuard } from './core/role-guard';
import { ManageProducts } from './admin/manage-products/manage-products';
import { ManageOrders } from './admin/manage-orders/manage-orders';
import { MyDeliveries } from './delivery/my-deliveries/my-deliveries';
import { ManageUsers } from './admin/manage-users/manage-users';
import { ManageDeliveries } from './admin/manage-deliveries/manage-deliveries';
import { StoreSettings } from './admin/store-settings/store-settings';
import { ChangePassword } from './client-area/change-password/change-password';
import { DashboardAdmin } from './admin/dashboard-admin/dashboard-admin';
import { DashboardLoja } from './admin/dashboard-loja/dashboard-loja';
import { DashboardEstafeta } from './delivery/dashboard-estafeta/dashboard-estafeta';
import { DashboardCliente } from './client-area/dashboard-cliente/dashboard-cliente';
import { CompareProducts } from './shop/compare-products/compare-products';
import { Profile } from './client-area/profile/profile';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'produtos/:id', component: ProductDetail },
  { path: '', component: Home },
  { path: 'carrinho', component: CartPage },
  { path: 'checkout', component: Checkout },
  { path: 'minhas-encomendas', component: MyOrders, canActivate: [authGuard] },
  {
    path: 'admin/categorias',
    component: ManageCategories,
    canActivate: [roleGuard],
    data: { roles: ['loja', 'admin'] },
  },
  {
    path: 'admin/produtos',
    component: ManageProducts,
    canActivate: [roleGuard],
    data: { roles: ['loja', 'admin'] },
  },
  {
    path: 'admin/encomendas',
    component: ManageOrders,
    canActivate: [roleGuard],
    data: { roles: ['loja', 'admin'] },
  },
  {
    path: 'entregas',
    component: MyDeliveries,
    canActivate: [roleGuard],
    data: { roles: ['estafeta'] },
  },
  {
    path: 'admin/utilizadores',
    component: ManageUsers,
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/entregas',
    component: ManageDeliveries,
    canActivate: [roleGuard],
    data: { roles: ['loja', 'admin'] },
  },
  {
    path: 'admin/loja',
    component: StoreSettings,
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },
  { path: 'alterar-password', component: ChangePassword, canActivate: [authGuard] },
  {
    path: 'admin/dashboard',
    component: DashboardAdmin,
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/dashboard-loja',
    component: DashboardLoja,
    canActivate: [roleGuard],
    data: { roles: ['loja', 'admin'] },
  },
  {
    path: 'dashboard-entregas',
    component: DashboardEstafeta,
    canActivate: [roleGuard],
    data: { roles: ['estafeta'] },
  },
  { path: 'dashboard-cliente', component: DashboardCliente, canActivate: [authGuard] },
  { path: 'comparar', component: CompareProducts },
  { path: 'perfil', component: Profile, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
