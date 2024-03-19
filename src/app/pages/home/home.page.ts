import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  // navigateToWindow() {
  //   this.router.navigate(['/home']);
  // }
  // navigateToLinux() {
  //   this.router.navigate(['/home']);
  // }
  // navigateToMac() {
  //   this.router.navigate(['/home']);
  // }
}
