import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

var PouchDB = require('pouchdb');//npm install pouchdb --save

@Injectable()
export class Data {

  fbid:number;
  username:string;
  picture:string;
  db : PouchDB;
  cloudant_username :string;
  cloudant_password :string;
  remote:string;
  data: any;

  constructor() {
    this.db = new PouchDB('camperChat');
    this.cloudant_username='';
    this.cloudant_password='';
    this.remote = '';

    //db setup
    let options = {
      live :true,
      retry:true,
      continuous:true,
      auth:{
        username : this.cloudant_username,
        password: this.cloudant_password
      }
    };

    this.db.sync(this.remote , options)//sync with cloudant
  }

addDocument(message) {
  this.db.put(message);
}

getDocuments(): Promise<any>{

  return new Promise(resolve =>{
    this.db.allDocs({
      include_docs : true,
      limit: 20,
      descending: true
    }).then((recieved)=>{
      this.data = [];
      let docs = recieved.rows.map((row) => {
        this.data.push(row.doc);
      });

      this.data.reverse();//get latest

      resolve(this.data);

      this.db.changes({live : true , since : 'now', include_docs:true}).on(
        'change',(change)=>{
          this.handleChange(change);
        });
      }).catch((error)=>{
        console.log(error);
      });
    });
}

handleChange(change){
  let changedDoc =null;
  let changedIndex = null;

  this.data.forEach((doc,index)=>{
    if(doc.db_id === change.id){
      changedDoc = doc;
      changedIndex = index;
    }
  });
  if(change.deleted){
    this.data.splice(changedIndex,1);
  }
  else{
    if(changedDoc){
      this.data[changedIndex] = change.doc;
    }
    else{
      this.data.push(change.doc);
    }
  }
}

}
