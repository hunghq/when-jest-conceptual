interface Item {
  name: string;
  selector: Function;
  behaviors?: Record<string, Function>;
}

export class Section {
  name: string;
  items: Record<string, Item> = {};

  constructor(items: Array<Item>, name = "it") {
    this.name = name;
    items.forEach((x) => {
      this.items[x.name] = x;
    });
  }

  get(itemName: string) {
    return this.items[itemName];
  }

  async retrieve(itemName: string) {
    const found = await this.get(itemName).selector();
    expect(found).toBeTruthy();
    return found;
  }

  async perform(behavior: string, itemName: string, parameter?: any) {
    const obj = await this.retrieve(itemName);
    const item = this.get(itemName);
    if (!item.behaviors || !Object.keys(item.behaviors).includes(behavior)) {
      throw Error(`Item ${itemName} does not have the behavior ${behavior}`);
    }
    item.behaviors[behavior].apply(item, [obj, parameter]);
  }
}

const given = (section: Section) => {
  const when = async (action: string, itemName: string, parameter?: any) => {
    section.perform(action, itemName, parameter);
  };

  return { when };
};

export { given };
