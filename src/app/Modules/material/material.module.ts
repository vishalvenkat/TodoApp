import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

const angularMaterial = [
  MatToolbarModule
];

@NgModule({
  exports: [angularMaterial],
  imports: [angularMaterial]
})
export class MaterialModule { }
