import { UrlRepository } from "../../../repositories/url.repository";
import { Url } from "../../../models/Url";

jest.mock("../../../models/Url"); // Mock the entire Url model

describe("UrlRepository", () => {
  let repo: UrlRepository;

  beforeEach(() => {
    repo = new UrlRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should save a new url", async () => {
      const mockData = { originalUrl: "http://example.com", shortUrl: "abc123" };
      const mockSaved = { ...mockData, _id: "1", clicks: 0 };

      (Url as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSaved),
      }));

      const result = await repo.create(mockData);
      expect(result).toEqual(mockSaved);
    });
  });

  describe("findByShortUrl", () => {
    it("should return url when found", async () => {
      const mockUrl = { shortUrl: "abc123", originalUrl: "http://example.com" };
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const result = await repo.findByShortUrl("abc123");
      expect(result).toEqual(mockUrl);
      expect(Url.findOne).toHaveBeenCalledWith({ shortUrl: "abc123" });
    });

    it("should return null when not found", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repo.findByShortUrl("xyz");
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return mapped urls", async () => {
      const mockUrls = [
        {
          _id: "1",
          originalUrl: "http://example.com",
          shortUrl: "abc123",
          clicks: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockUrls),
      });

      (Url.find as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await repo.findAll();
      expect(result[0]).toMatchObject({
        id: "1",
        originalUrl: "http://example.com",
        shortUrl: "abc123",
        clicks: 5,
      });
    });
  });

  describe("incrementClicks", () => {
    it("should increment clicks", async () => {
      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue({});
      await repo.incrementClicks("abc123");
      expect(Url.findOneAndUpdate).toHaveBeenCalledWith(
        { shortUrl: "abc123" },
        { $inc: { clicks: 1 } }
      );
    });
  });

  describe("findStatsByShortUrl", () => {
    it("should return stats when found", async () => {
      const mockUrl = {
        _id: "1",
        originalUrl: "http://example.com",
        shortUrl: "abc123",
        clicks: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelect = jest.fn().mockResolvedValue(mockUrl);
      (Url.findOne as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await repo.findStatsByShortUrl("abc123");
      expect(result).toMatchObject({
        id: "1",
        originalUrl: "http://example.com",
        shortUrl: "abc123",
        clicks: 10,
      });
    });

    it("should return null when not found", async () => {
      const mockSelect = jest.fn().mockResolvedValue(null);
      (Url.findOne as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await repo.findStatsByShortUrl("xyz");
      expect(result).toBeNull();
    });
  });
});
