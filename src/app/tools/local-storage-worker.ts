import { isString } from 'lodash-es';

// tslint:disable-next-line: prefer-const
declare var window: any;

// tslint:disable-next-line: prefer-const
declare var localStorage: any;

export class LocalStorageWorker {
  public static add(key: string, item: any) {
    return LocalStorageWorker._get().add(key, item);
  }
  // get one item by key from storage
  public static get(key: string, defaultValue?: any): any {
    const result = LocalStorageWorker._get().get(key);
    return undefined === result ? defaultValue : result;
  }

  // remove value from storage
  public static remove(key: string) {
    LocalStorageWorker._get().remove(key);
  }

  // clear storage (remove all items from it)
  public static clear() {
    LocalStorageWorker._get().clear();
  }
  private static _get(): LocalStorageWorker {
    return new LocalStorageWorker();
  }
  public localStorageSupported: boolean;

  private constructor() {
    this.localStorageSupported = !!window?.localStorage;
  }

  // add value to storage
  public add(key: string, item: any) {
    if (this.localStorageSupported) {
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  // get one item by key from storage
  public get(key: string): any {
    let result = undefined;
    try {
      if (this.localStorageSupported) {
        const json = localStorage.getItem(key);
        if (isString(json)) {
          result = JSON.parse(localStorage.getItem(key));
        }
      }
    } catch (error) {}
    return result;
  }

  // remove value from storage
  public remove(key: string) {
    if (this.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  // clear storage (remove all items from it)
  public clear() {
    if (this.localStorageSupported) {
      localStorage.clear();
    }
  }
}
