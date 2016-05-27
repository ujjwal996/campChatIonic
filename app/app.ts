import {App, Platform , Nav , MenuController} from 'ionic-angular';
import {StatusBar, Facebook} from 'ionic-native';
import {ViewChild} from '@angular/core';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import {Data} from './providers/data/data';
import {AboutPage} from './pages/about/about';

@App({
  templateUrl: 'build/app.html',
  providers : [Data],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {

  @ViewChild(Nav) nav:Nav;
  rootPage = LoginPage;
  homePage = HomePage;
  abuotPage = AboutPage;


  constructor(platform: Platform, public _dataservice:Data, public menu:MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

    openPage(page){
      this.menu.close();
      this.nav.setRoot(page);
    }

    logout(){
      this.menu.close();
      this.menu.enable(false);

      this.nav.setRoot(LoginPage);

      this._dataservice.fbid=null;
      this._dataservice.username=null;
      this._dataservice.picture=null;

      Facebook.logout();
    }

}
