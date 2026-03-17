import { toBase62, fromBase62 } from "../../../utils/base62";

describe("Base62 conversion utilities", () => {
  describe("toBase62", () => {
    it("should return '0' when input is 0", () => {
      expect(toBase62(0)).toBe("0");
    });

    it("should convert small numbers correctly", () => {
      expect(toBase62(1)).toBe("1");
      expect(toBase62(10)).toBe("a"); // 10th char in BASE62_CHARS
      expect(toBase62(61)).toBe("Z"); // last char in BASE62_CHARS
    });

    it("should convert larger numbers correctly", () => {
      expect(toBase62(62)).toBe("10"); // 62 in base62 is "10"
      expect(toBase62(123)).toBe("1Z");
      expect(toBase62(3843)).toBe("ZZ"); // 61*62 + 61
    });
  });

  describe("fromBase62", () => {
    it("should convert '0' to 0", () => {
      expect(fromBase62("0")).toBe(0);
    });

    it("should convert single characters correctly", () => {
      expect(fromBase62("1")).toBe(1);
      expect(fromBase62("a")).toBe(10);
      expect(fromBase62("Z")).toBe(61);
    });

    it("should convert multi-character strings correctly", () => {
      expect(fromBase62("10")).toBe(62);
      expect(fromBase62("1Z")).toBe(123);
      expect(fromBase62("ZZ")).toBe(3843);
    });
  });

  describe("round-trip conversions", () => {
    it("should convert back and forth consistently", () => {
      const numbers = [0, 1, 10, 61, 62, 123, 9999, 123456];
      numbers.forEach(num => {
        const encoded = toBase62(num);
        const decoded = fromBase62(encoded);
        expect(decoded).toBe(num);
      });
    });
  });
});


/**
 * What this covers
✅ Edge case: 0.

✅ Single‑digit conversions (1, a, Z).

✅ Multi‑digit conversions (10, 1Z, ZZ).

✅ Round‑trip consistency for a range of numbers.

This ensures both functions are thoroughly tested and you can trust them in your URL shortener logic.
 */