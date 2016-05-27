import {Page, Alert} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Facebook} from 'ionic-native';
import {Data} from "../../providers/data/data";
import {LoginPage} from '../login/login';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  @ViewChild('chatcontent') chatcontent : any;
chatMessage : any ;
chatMessagesAll : any[];
  constructor(public _dataservice : Data) {
    this._dataservice.getDocuments().then((data)=>
    {
      this.chatMessagesAll = data;
      this.chatcontent.scrollTo(0,99999,0);
    });
  }

sendMessage(){
  let messages = {
    'db_id': new Date().toJSON(),
    'name': this._dataservice.username,
    'fbid':this._dataservice.fbid,
    'picture':this._dataservice.picture,
    'message': this.chatMessage
  }
  this._dataservice.addDocument(messages);
  this.chatMessage ='';
}

}
