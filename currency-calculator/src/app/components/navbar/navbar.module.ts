import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {MatRippleModule} from "@angular/material/core";



@NgModule({
  declarations: [
    NavbarComponent
  ],
  exports: [NavbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatRippleModule
  ]
})
export class NavbarModule { }
