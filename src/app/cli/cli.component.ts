import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { FileRestService } from '../shared/services/files/file-rest.service';
import { FileService } from '../shared/services/files/file.service';

@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.scss'],
})
export class CliComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) terminal: NgTerminal;

  readonly ENTER_KEYCODE = 13;
  readonly BACKSPACE_KEYCODE = 8;
  readonly GREEN_ANSI_COLOR = '\x1b[1;32m';
  readonly BLUE_ANSI_COLOR = '\x1b[1;34m';
  readonly WHITE_ANSI_COLOR = '\x1b[37m';
  readonly supportedCommands = {
    cd: 'cd',
    ls: 'ls',
    help: 'help',
  }
  systemName = 'file-system';
  prefix = `${this.GREEN_ANSI_COLOR}${this.systemName} ${this.WHITE_ANSI_COLOR}`;
  currentPath = '/';
  command = '';

  get fixedText(): number {
    return `${this.systemName}${this.currentPath}$ `.length + 1;
  }

  constructor(
    private readonly fileExplorerService: FileRestService,
    private readonly fileService: FileService,
  ) {}

  ngOnInit(): void {}

  public onTyping() {
    this.terminal.keyEventInput.subscribe(async (e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === this.ENTER_KEYCODE) {
        await this.execute(this.command, this.terminal);
        this.command = '';
        this.terminal.write(`\r\n${this.prefix}${this.currentPath}$ `);
      } else if (ev.keyCode === this.BACKSPACE_KEYCODE) {
        if (this.terminal.underlying.buffer.active.cursorX > this.fixedText) {
          this.terminal.write('\b \b');
          this.command = this.command.substring(0, this.command.length - 1);
        }
      } else if (printable) {
        this.terminal.write(e.key);
        this.command = this.command.concat(e.key);
      }
    });
  }

  public ngAfterViewInit(): void {
    if (this.terminal) {
      this.terminal.write(`hint: type 'help' to see supported commands\r\n`);
      this.terminal.write(`${this.prefix}${this.currentPath}$ `);
    }

    this.onTyping();
  }

  public async execute(command: string, child: NgTerminal) {
    command = command.replace('\r', '');
    const args = command.split(' '); // need to refactor to regex
    const cmd = args[0];
    if (!this.supportedCommands[cmd]) {
      this.terminal.write(`\r\n  ${command} - command not found`);
      return;
    }

    console.log(args);
    switch (cmd) {
      case 'ls': {
        await this.fileExplorerService.list(this.currentPath).then((resp) => {
          const items = resp.data;
          items.forEach((item) =>
            this.terminal.write(`\r\n ${this.showItemInfo(item)}`)
            );
          this.terminal.write(`\r\n  Total: ${items.length}`);
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
            this.terminal.write(`\r\n  Cannot found ${targetPath}`);
          }
        });
        break;
      }
      case 'help': {
        this.showHelp();
        break;
      }
    }
  }

  public showItemInfo(item): string {
    // file shows in blue color, otherwise white color.
    return `${item.folder ? this.WHITE_ANSI_COLOR : this.BLUE_ANSI_COLOR}`
      +`${item.folder ? 'd' : 'f'} - ${item.createAt ?  new Date(item.createAt).toJSON().slice(0,10).split('-').reverse().join('/') : '-'} - ${item.name}${this.WHITE_ANSI_COLOR}`
  }

  public cdExtract(cmd: string) {
    let clone_currentPath = this.currentPath;

    // [..] : back to parent
    const backLevels = cmd.match(/\.{2}/g);
    if (backLevels) {
      const n = backLevels ? backLevels.length : 0;
      for (let i = 0; i < n; i++) {
        clone_currentPath = this.fileService.popFromPath(clone_currentPath);
      }

      // back to parent and navigate to another dir
      let folders = cmd.split('/');
      folders = folders.filter(x => !(/\.{2}/).test(x));
      folders.forEach(folder => clone_currentPath = this.fileService.pushToPath(clone_currentPath, folder))
      return clone_currentPath;
    }

    // [ / ] : back to home
    if (this.isRoot(cmd)) {
      clone_currentPath = cmd;
      return clone_currentPath;
    }

    return this.fileService.pushToPath(clone_currentPath, cmd);
  }

  public isRoot(currentPath): boolean {
    return currentPath == '/';
  }

  public showHelp() {
    this.terminal.write(`\r\n  cd FOLDER_PATH  : change current working directory/folder to the specified FOLDER`);
    this.terminal.write(`\r\n  ls              : list out all items directly under a folder`);
  }
}
