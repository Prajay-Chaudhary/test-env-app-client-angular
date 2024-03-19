import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-virtual-machine-test',
  templateUrl: './virtual-machine-test.component.html',
  styleUrls: ['./virtual-machine-test.component.scss'],
})
export class VirtualMachineTestComponent implements OnInit {
  isSingleMachineUser: boolean = false;
  isMultipleOSUser: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles(); // Get user roles from AuthService
    console.log('User Roles:', roles);
    // Set flags based on user roles
    this.isSingleMachineUser = roles.includes('Single Machine Access');
    this.isMultipleOSUser = roles.includes('Multiple OS Access');
  }

  testOnWindows() {
    this.dataService.testOnWindows().subscribe(
      (response) => {
        // Handle success response
        console.log('Test on Window successful:', response);
      },
      (error) => {
        // Handle error
        console.error('Error testing on Window:', error);
      }
    );
  }

  testOnLinux() {
    this.dataService.testOnLinux().subscribe(
      (response) => {
        // Handle success response
        console.log('Test on Linux successful:', response);
      },
      (error) => {
        // Handle error
        console.error('Error testing on Linux:', error);
      }
    );
  }
}
