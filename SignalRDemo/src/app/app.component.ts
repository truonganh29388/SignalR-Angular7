import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private el: ElementRef, private _fb: FormBuilder, private _appService: AppService) {

  }

  public frm: FormGroup;

  userList: any;
  toUser: string ='';
  title = 'app';
  access_token: string;
  user: any;
  connection: signalR.HubConnection;
  //connection: any;
  ngOnInit(): void {
    this.frm = this._fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
    });
    this.getDefaultUser()
    this.getUserList()
  }

private getDefaultUser(){
  var userInfo = localStorage.getItem('userInfo')
  var accessToken = localStorage.getItem('access-token')
  this.user = userInfo
  this.access_token = accessToken
}

  public send() {
    const tbMessage: HTMLInputElement = this.el.nativeElement.querySelector('#tbMessage');
    if (!this.toUser || tbMessage.value == '' || !this.connection)
      return
    this.connection.send('sendMsgToUser', this.user.firstName + this.user.lastName, this.toUser, tbMessage.value)
      .then(() => tbMessage.value = '');
  }

  public onSubmit() {
    if (this.frm.valid) {
      this._appService.getToken(this.frm.value).subscribe(resp => {
        this.access_token = resp.data.accessToken
        localStorage.setItem('userInfo',resp.data.userInfo)
        localStorage.setItem('access-toke', this.access_token)
        this.user = resp.data.userInfo
        this.setupConnection()
      })
    }
  }

  private setupConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44337/hub',
        { accessTokenFactory: () => this.access_token })
      .build();
    this.connection.start().catch(err => this.el.nativeElement.write(err));
    this.connection.on('messageReceived', (username: string, message: string) => {
      const m = document.createElement('div');

      m.innerHTML =
        `<div class='message-author'>${username}</div><div>${message}</div>`;
      const divMessages: HTMLDivElement = this.el.nativeElement.querySelector('#divMessages');
      divMessages.appendChild(m);
      divMessages.scrollTop = divMessages.scrollHeight;
      const tbMessage: HTMLInputElement = this.el.nativeElement.querySelector('#tbMessage');
      tbMessage.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
          this.send();
        }
      });
    });
  }

  private getUserList() {
    this._appService.getUserList().subscribe(resp => {
      this.userList = resp.data
    })
  }
}