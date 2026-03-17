import { CacheRepository } from "../../../repositories/cache.repository";
import { redisClient } from "../../../config/redis";
import { serverConfig } from "../../../config";

jest.mock("../../../config/redis", () => ({
  redisClient: {
    isOpen: false,
    connect: jest.fn(),
    incr: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

describe("CacheRepository", () => {
  let repo: CacheRepository;

  beforeEach(() => {
    repo = new CacheRepository();
    jest.clearAllMocks();
  });

  describe("getNextId", () => {
    it("should connect if not open and increment counter", async () => {
      (redisClient.incr as jest.Mock).mockResolvedValue(42);

      const result = await repo.getNextId();

      expect(redisClient.connect).toHaveBeenCalled();
      expect(redisClient.incr).toHaveBeenCalledWith(serverConfig.REDIS_COUNTER_KEY);
      expect(result).toBe(42);
    });
  });

  describe("setUrlMapping", () => {
    it("should connect if not open and set mapping with expiry", async () => {
      await repo.setUrlMapping("abc", "http://example.com");

      expect(redisClient.connect).toHaveBeenCalled();
      expect(redisClient.set).toHaveBeenCalledWith(
        "url.abc",
        "http://example.com",
        { EX: 86400 }
      );
    });
  });

  describe("getUrlMapping", () => {
    it("should connect if not open and get mapping", async () => {
      (redisClient.get as jest.Mock).mockResolvedValue("http://example.com");

      const result = await repo.getUrlMapping("abc");

      expect(redisClient.connect).toHaveBeenCalled();
      expect(redisClient.get).toHaveBeenCalledWith("url.abc");
      expect(result).toBe("http://example.com");
    });

    it("should return null if key not found", async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await repo.getUrlMapping("missing");

      expect(result).toBeNull();
    });
  });

  describe("deleteUrlMapping", () => {
    it("should connect if not open and delete mapping", async () => {
      await repo.deleteUrlMapping("abc");

      expect(redisClient.connect).toHaveBeenCalled();
      expect(redisClient.del).toHaveBeenCalledWith("url.abc");
    });
  });
});
/**
 * 
 * What this covers
✅ Ensures ensureConnected is called when redisClient.isOpen is false.

✅ Verifies getNextId increments the counter key.

✅ Verifies setUrlMapping sets the key with a 24‑hour expiry.

✅ Verifies getUrlMapping retrieves the value or returns null.

✅ Verifies deleteUrlMapping deletes the key.
 */