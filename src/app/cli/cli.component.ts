import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { Observable } from 'rxjs';
import { FileRestService } from '../shared/services/files/file-rest.service';

@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.scss'],
})
export class CliComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;

  public readonly ENTER_KEYCODE = 13;
  public readonly BACKSPACE_KEYCODE = 8;
  public readonly GREEN_ANSI_COLOR = '\x1b[1;32m';
  public readonly BLUE_ANSI_COLOR = '\x1b[1;34m';
  public readonly WHITE_ANSI_COLOR = '\x1b[37m';
  public prefix = `${this.GREEN_ANSI_COLOR}file-system: ${this.WHITE_ANSI_COLOR}`;
  public currentPath = '/';
  public command = '';

  constructor(private readonly fileExplorerService: FileRestService) {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    if (this.child) {
      this.child.write(`hint: type 'help' to see supported commands\r\n`);
      this.child.write(`${this.prefix}${this.currentPath}$ `);
    }

    this.child.keyEventInput.subscribe(async (e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === this.ENTER_KEYCODE) {
        await this.execute(this.command, this.child);
        this.command = '';
        this.child.write(`\r\n${this.prefix}${this.currentPath}$ `);
      } else if (ev.keyCode === this.BACKSPACE_KEYCODE) {
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
          this.command = this.command.substring(0, this.command.length - 1);
        }
      } else if (printable) {
        this.child.write(e.key);
        this.command = this.command.concat(e.key);
      }
    });
  }

  public async execute(command: string, child: NgTerminal) {
    command = command.replace('\r', '');
    const args = command.split(' ');
    const cmd = args[0];
    console.log(args);
    switch (cmd) {
      case 'ls': {
        await this.fileExplorerService.list(this.currentPath).then((resp) => {
          const items = resp.data;
          items.forEach((item) =>
            this.child.write(`\r\n ${this.showItemInfo(item)}`)
            );
          this.child.write(`\r\n  Total: ${items.length}`);
        });
        break;
      }
      case 'cd': {
        const targetPath = this.cdExtract(args[1]);
        await this.fileExplorerService.changeDirect(targetPath).then((resp) => {
          const valid = resp.data;
          if (valid || targetPath == '/') {
            this.currentPath = targetPath;
          } else {
            this.child.write(`\r\n  Cannot found ${targetPath}`);
          }
        });
        break;
      }
      case 'help': {
        this.showHelp();
        break;
      }
      default: {
        this.child.write(`\r\n  ${command} - command not found`);
        break;
      }
    }
  }

  public showItemInfo(item): string {
    // file shows in blue color, otherwise white color.
    return `${item.folder ? this.WHITE_ANSI_COLOR : this.BLUE_ANSI_COLOR}`
      +`${item.folder ? 'd' : 'f'} - ${item.createAt ?  new Date(item.createAt).toJSON().slice(0,10).split('-').reverse().join('/') : '-'} - ${item.name}`
  }

  // TODO: add to service
  public popFromPath(path: string) {
    if (this.isRoot(path)) {
      return path;
    }

    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  // TODO: add to service
  public pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  public cdExtract(cmd: string) {
    let clone_currentPath = this.currentPath;

    // [..] : back to parent
    const backLevels = cmd.match(/\.{2}/g);
    if (backLevels) {
      const n = backLevels ? backLevels.length : 0;
      for (let i = 0; i < n; i++) {
        clone_currentPath = this.popFromPath(clone_currentPath);
      }

      // back to parent and navigate to another dir
      let folders = cmd.split('/');
      folders = folders.filter(x => !(/\.{2}/).test(x));
      folders.forEach(folder => clone_currentPath = this.pushToPath(clone_currentPath, folder))
      return clone_currentPath;
    }

    // [ / ] : back to home
    if (this.isRoot(cmd)) {
      clone_currentPath = cmd;
      return clone_currentPath;
    }

    return this.pushToPath(clone_currentPath, cmd);
  }

  public isRoot(currentPath) {
    return currentPath == '/';
  }

  public showHelp() {
    this.child.write(`\r\n  cd FOLDER_PATH  : change current working directory/folder to the specified FOLDER`);
    this.child.write(`\r\n  ls              : list out all items directly under a folder`);
  }
}
