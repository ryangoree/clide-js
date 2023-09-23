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
  return ([] as any).concat(
    Object.keys(obj),
    ...Object.values(obj).map(({ alias }) => alias),
  );
}
