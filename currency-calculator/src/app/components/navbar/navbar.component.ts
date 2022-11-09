import { Component, OnInit } from '@angular/core';

export interface INavItem {
  link: string,
  name: string
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public links: INavItem[] = [
    {
      link: '/calculator',
      name: 'Calculator'
    },
    {
      link: '/history',
      name: 'History'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
