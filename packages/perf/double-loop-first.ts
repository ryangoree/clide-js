const optionsConfig = {
  name: {
    description: 'The name of the person to greet',
    type: 'string',
    alias: ['n', 'nm', 'first-name'],
    default: 'world',
  },
  age: {
    description: 'The age of the person to greet',
    type: 'number',
    alias: ['a'],

    // required: true,
  },
};

const options = {
  'first-name': 'world',
  age: 30,
};

const getter = {
  get: function (keys: string[]) {
    return keys.reduce(
      (acc, key) => {
        acc[key] = (this as any)[key]();
        return acc;
      },
      {} as Record<string, unknown>,
    );
  },
  'first-name': () => options['first-name'],
  age: () => options.age,
};

export default function foo() {
  for (const key in optionsConfig) {
    const config = (optionsConfig as any)[key];
    const keys = [key, ...(config.alias || [])];
    const missing = new Set<string>();
    let foundKey: string | undefined;
    for (const key of keys) {
      if (key in getter) {
        foundKey = key;
      } else {
        missing.add(key);
      }
    }
    if (foundKey) {
      missing.forEach((key) => {
        (getter as any)[key] = (getter as any)[foundKey as any];
      });
    } else {
      missing.forEach((key) => {
        (getter as any)[key] = () => (options as any)[key];
      });
    }
  }
  return (getter as any).nm();
}
