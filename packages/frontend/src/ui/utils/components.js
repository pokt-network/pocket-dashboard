// Forward some props of an instance to a child element.
//
// Usage example:
//
//   <Child {...forwardProps(this, ['name', 'style'])}>
//
export function forwardProps(instance, names) {
  return names.reduce((props, name) => {
    if (instance.props[name]) {
      props[name] = instance.props[name];
    }
    return props;
  }, {});
}

// Forward the props useful to extend the styles  of the main child of a
// component, using either styled() or the style attribute. Additionnal names
// can be passed as a second parameter.
export function stylingProps(instance, names = []) {
  return forwardProps(instance, ["style", "className", ...names]);
}
