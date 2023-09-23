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
    Object.keys(obj),
    ...Object.values(obj).map(({ alias }) => alias),
  ].flat();
}
