import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule} from './Modules/material/material.module';
import { HeaderComponent } from './Components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './Components/footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './Components/index/index.component';
import { GetStartedComponent } from './Components/get-started/get-started.component';
import { LoginComponent } from './Components/login/login.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomePageComponent} from './Components/home-page/home-page.component';
import { CommonModule } from '@angular/common';
import { AddTodoComponent } from './Components/add-todo/add-todo.component';
import { EditPromptComponent } from './Components/edit-prompt/edit-prompt.component';

const appRoutes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'Homepage', component: HomePageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    GetStartedComponent,
    LoginComponent,
    RegistrationComponent,
    HomePageComponent,
    AddTodoComponent,
    EditPromptComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  entryComponents: [GetStartedComponent, AddTodoComponent, EditPromptComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
