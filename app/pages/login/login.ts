import {Page, NavController, MenuController, Alert, Loading } from 'ionic-angular';
import {Facebook} from 'ionic-native';
import {HomePage} from '../home/home';
import {Data} from '../../providers/data/data';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  loading :Loading;
  constructor(public nav: NavController, public menu : MenuController, public _dataservice : Data) {
    this.menu.enable(false);
    this.loading = Loading.create({
      content : 'To tell you am not frozen while I see you exist'
    })
  }

  login() {
    this.nav.present(this.loading);
    Facebook.login(['public_profile']).then((response)=>{
      this.getProfile();
    },
    (err)=> {
      let alert = Alert.create({
        title:"Error",
        subTitle: 'Try again.',
        buttons :['OK']
      });
      this.loading.dismiss();
      this.nav.present(alert);
    }
  );
  }

  getProfile(){
    Facebook.api('/me?fields=id,name,picture',['public_profile']).then(
      (response)=> {
        this._dataservice.fbid=response.id;
        this._dataservice.username=response.name;
        this._dataservice.picture=response.picture.data.url;

        this.loading.dismiss();
        this.menu.enable(true);
        this.nav.setRoot(HomePage);
      },
      (err)=>{
        let alert = Alert.create({
          title : "Couldn't get your info",
          subTitle : "You can't continue right now, Try again later",
          buttons:['Will check it out']
        });
        this.loading.dismiss();
        this.nav.present(alert);
      }
    );

  }
}
