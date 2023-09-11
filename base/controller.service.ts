// deno-lint-ignore-file no-explicit-any
import { ControllerMetadata } from './server.interface.ts';
import { Reflect } from 'https://deno.land/x/reflect_metadata@v0.1.12/mod.ts';

export class ControllerService {
  async #downloadFile(from: string, to: string) {
    const response = await fetch(from);
    const file = await Deno.open(to, {
      create: true,
      write: true,
      truncate: true,
    });
    await response.body?.pipeTo(file.writable);
    if (file.rid in Deno.resources()) Deno.close(file.rid);
  }

  async #downloadControllers(subjects: string[], pathToControllers: string) {
    await Promise.all(
      subjects.map(async (subject) => {
        await Deno.mkdir(`${pathToControllers}/${subject}-controller`, {
          recursive: true,
        });
        await this.#downloadFile(
          `http://10.0.3.137:8080/controller/${subject}-controller/mod.ts`,
          `${pathToControllers}/${subject}-controller/mod.ts`,
        );
        await this.#downloadFile(
          `http://10.0.3.137:8080/controller/${subject}-controller/${subject}.controller.ts`,
          `${pathToControllers}/${subject}-controller/${subject}.controller.ts`,
        );
      }),
    );
  }

  async getAllControllers(subjects: string[]) {
    // await this.#downloadControllers(subjects, pathToControllers);

    const controllers = await Promise.all(
      subjects.map(async (subject) => {
        const mod = await import(
          `@his/controller/${subject}-controller/mod.ts`
        );
        return (
          mod[`${subject[0].toUpperCase() + subject.slice(1)}Controller`] ||
          mod.default
        );
      }),
    );
    return Object.values(controllers).map(
      (Class: { new (...args: any[]): object }) => new Class(),
    );
  }

  getControllerMetadata(controller: object): ControllerMetadata {
    const ControllerClass = controller.constructor;
    return {
      consumer: Reflect.getMetadata('consumer', ControllerClass),
      subscribers: Reflect.getMetadata('subscribers', controller) || [],
      repliers: Reflect.getMetadata('repliers', controller) || [],
    };
  }
}
