import { Component, OnInit } from '@angular/core';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  faPenNib = faPenNib;
  faUser = faUser;
  faCaretRight = faCaretRight;

  constructor() { }

  ngOnInit(): void {
  }
}
