export interface Item {
  name: string;
  selector: (section: Section) => any;
  behaviors?: Record<string, Function>;
}

export class Section {
  name?: string;
  items: Record<string, Item> = {};

  constructor(items: Array<Item>, name?: string) {
    this.name = name;
    items.forEach((x) => {
      this.items[x.name] = x;
    });
  }

  get(itemName: string): Item {
    if (!Object.keys(this.items).includes(itemName))
      throw Error(
        `Cannot find item ${itemName} in section ${this.name ?? "[default]"}`
      );
    return this.items[itemName];
  }

  retrieve<T>(itemName: string): T {
    const section = this;
    const item = this.get(itemName);
    const selector = item.selector;
    return selector.apply(section, [section]);
  }

  async perform(behavior: string, itemName: string, parameter?: any) {
    const obj = this.retrieve(itemName);
    const item = this.get(itemName);

    if (!item.behaviors || !Object.keys(item.behaviors).includes(behavior)) {
      throw Error(`Item ${itemName} does not have the behavior ${behavior}`);
    }

    const func = item.behaviors[behavior];
    if (func.constructor.name === "AsyncFunction") {
      await func.apply(item, [obj, parameter]);
    } else {
      func.apply(item, [obj, parameter]);
    }
  }
}

const given = (section: Section) => {
  const when = async (action: string, itemName: string, parameter?: any) => {
    await section.perform(action, itemName, parameter);
  };

  const expectInSection = (actual: any): jest.JestMatchers<any> => {
    if (typeof actual === "string") {
      return expect(section.retrieve(actual));
    }

    return expect(actual);
  };

  return { when, expect: expectInSection };
};

export { given };
