const arrayMoveMutable = (array, from, to) => {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
};

const arrayMoveImmutable = (array, from, to) => {
  array = array.slice();
  arrayMoveMutable(array, from, to);
  return array;
};

export { arrayMoveImmutable, arrayMoveMutable };
