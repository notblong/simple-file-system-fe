import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgTerminalModule } from 'ng-terminal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CliModule } from './cli/cli.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { FileService } from './shared/services/files/file.service';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgTerminalModule,
    FileExplorerModule,
    CliModule
  ],
  providers: [FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
