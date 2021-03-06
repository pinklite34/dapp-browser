import { ChildProcess, spawn } from 'child_process';
import { TaskProcess } from './TaskProcess';

interface Task {
  command: 'create' | 'sign_hex' | 'list' | 'lock' | 'unlock' | 'public_key';
  params?: any;
  promise: {
    resolve: any,
    reject: any,
  };
}

class Queue {
  private activeProcess?: TaskProcess;
  public keychain: ChildProcess;
  private queue: Task[];
  private path: string;

  constructor(path: string) {
    this.keychain = spawn(path, ['--mode=test_run']); // todo remove mode=test_run
    this.path = path;
    this.queue = [];
  }

  public push(task: Task) {
    this.queue.push(task);

    if (!this.activeProcess) {
      this.next();
    }
  }

  private async next() {
    if (!this.activeProcess) {
      const task = this.queue.shift();

      if (task) {
        this.activeProcess = new TaskProcess(this, task);

        getter_loop: while (true) {
          try {
            const result = await this.activeProcess.run();
            this.activeProcess.task.promise.resolve(result);
            break getter_loop;
          } catch (error) {
            if (!error.normal) {
              // Restart daemon
              this.keychain = spawn(this.path, ['--mode=test_run']); // todo remove mode=test_run

              if (!this.activeProcess.retries) {
                this.activeProcess.task.promise.reject(error);
                break getter_loop;
              }
            } else {
              this.activeProcess.task.promise.reject(error);
              break getter_loop;
            }
          }
        }

        this.activeProcess = undefined;
        this.next();
      }
    }
  }
}

export { Task, Queue };
