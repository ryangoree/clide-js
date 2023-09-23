const obj = {
  name: {
    alias: ['n', 'nm'],
  },
  age: {
    alias: ['a'],
  },
  o: {
    alias: ['out-file', 'out'],
  },
};

export default function () {
  return [
    ...Object.keys(obj),
    ...([] as any).concat(Object.values(obj).map(({ alias }) => alias)),
  ];
}
