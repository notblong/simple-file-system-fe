import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CliComponent } from './cli.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    CliComponent,
  ],
  exports: [CliComponent],
  entryComponents: [
    CliComponent,
  ]
})
export class CliModule {}
