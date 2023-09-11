// deno-lint-ignore-file no-explicit-any
class InstanceProvider {
  static #instances: InstanceType<any>[] = [];

  static async initialize(initializations: (object | Promise<object>)[]) {
    InstanceProvider.#instances = await Promise.all(initializations);
  }

  static get<T extends { new (...args: any[]): InstanceType<T> }>(
    Class: T,
  ): InstanceType<T> {
    let foundInstance = InstanceProvider.#instances.find(
      (instance) => instance instanceof Class,
    );

    if (!foundInstance) {
      InstanceProvider.#instances.push(new Class());
      foundInstance = InstanceProvider.#instances.find(
        (instance) => instance instanceof Class,
      );
    }

    return foundInstance;
  }
}

export const initializeProvider = InstanceProvider.initialize;

export const inject = <T extends { new (...args: any[]): InstanceType<T> }>(
  Class: T,
) => InstanceProvider.get(Class);
