export default function (obj, propertyName) {
  return (
    Object.prototype.hasOwnProperty.call(obj, propertyName) &&
      obj[propertyName] !== ''
  );
}
