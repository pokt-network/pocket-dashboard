import color from "./color";

describe("color()", () => {
  test("it parses colors", () => {
    expect(String(color("#fff"))).toEqual("#FFFFFF");
    expect(String(color("#000"))).toEqual("#000000");
    expect(color("#fbfbfb").toObject()).toEqual({ r: 251, g: 251, b: 251 });
  });

  test("it throws if an invalid color is passed to it", () => {
    expect(() => {
      color("#1234");
    }).toThrow();
  });

  test("it accepts a String wrapper object as a value", () => {
    /* eslint-disable no-new-wrappers */
    expect(String(color(new String("#fff")))).toEqual("#FFFFFF");
    /* eslint-enable no-new-wrappers */
  });

  test("it accepts an alpha setting", () => {
    expect(color("#fff").alpha(0.1)).toEqual("rgba(255, 255, 255, 0.1)");
    expect(color("#fff").alpha(2)).toEqual("rgba(255, 255, 255, 1)");
    expect(color("#fff").alpha(-2)).toEqual("rgba(255, 255, 255, 0)");
  });
});
