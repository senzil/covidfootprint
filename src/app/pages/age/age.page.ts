import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from 'src/app/services/user-service/user.service';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';

@Component({
  selector: 'app-age',
  templateUrl: './age.page.html',
  styleUrls: ['./age.page.scss'],
})
export class AgePage implements OnInit {
  birthyear: { input: number; };
  constructor(
    private userManager: UserService,
    private navigation: NavigationService
  ) {
    this.birthyear = { input: 2020 };
  }

  ngOnInit() {
  }

  continue(){
    this.userManager.setBithYear(this.birthyear.input);
    this.navigation.setRoot(NAVIGATIONPAGES.WIZARD);
  }
}
