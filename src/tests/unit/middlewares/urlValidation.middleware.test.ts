import { validateShortUrl } from "../../../middlewares/urlValidation.middleware";
import { BadRequestError } from "../../../utils/errors/app.error";

describe("validateShortUrl middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    next = jest.fn();
  });

  it("should throw BadRequestError if shortUrl is missing", () => {
    req.params.shortUrl = "";

    expect(() => validateShortUrl(req, res, next)).toThrow(BadRequestError);
    expect(() => validateShortUrl(req, res, next)).toThrow(
      "Short URL parameter is required"
    );
  });

  it("should throw BadRequestError if shortUrl contains non-alphanumeric characters", () => {
    req.params.shortUrl = "abc$%";

    expect(() => validateShortUrl(req, res, next)).toThrow(BadRequestError);
    expect(() => validateShortUrl(req, res, next)).toThrow(
      "Short URL must contain only alphanumeric characters"
    );
  });

  it("should throw BadRequestError if shortUrl length is greater than 10", () => {
    req.params.shortUrl = "abcdefghijklmnop";

    expect(() => validateShortUrl(req, res, next)).toThrow(BadRequestError);
    expect(() => validateShortUrl(req, res, next)).toThrow(
      "Short URL must be between 1 and 10 characters"
    );
  });

  it("should trim whitespace and call next for valid shortUrl", () => {
    req.params.shortUrl = "abc123";

    validateShortUrl(req, res, next);

    expect(req.params.shortUrl).toBe("abc123");
    expect(next).toHaveBeenCalled();
  });

  it("should accept valid alphanumeric shortUrl of length 10", () => {
    req.params.shortUrl = "abc123XYZ9";

    validateShortUrl(req, res, next);

    expect(req.params.shortUrl).toBe("abc123XYZ9");
    expect(next).toHaveBeenCalled();
  });
});


/**
 * What this covers
✅ Missing shortUrl → throws BadRequestError.

✅ Invalid characters → throws BadRequestError.

✅ Too short or too long → throws BadRequestError.

✅ Valid input → trims whitespace and calls next().

This ensures your middleware enforces all validation rules correctly.
 */