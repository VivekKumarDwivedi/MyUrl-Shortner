import { UrlService } from '../../../services/url.service';
import { UrlRepository } from '../../../repositories/url.repository';
import { CacheRepository } from '../../../repositories/cache.repository';

jest.mock('../../../repositories/url.repository');
jest.mock('../../../repositories/cache.repository');

describe('UrlService', () => {
  let urlRepository: jest.Mocked<UrlRepository>;
  let cacheRepository: jest.Mocked<CacheRepository>;
  let service: UrlService;

  beforeEach(() => {
    urlRepository = new UrlRepository() as jest.Mocked<UrlRepository>;
    cacheRepository = new CacheRepository() as jest.Mocked<CacheRepository>;
    service = new UrlService(urlRepository, cacheRepository);
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a short url and cache mapping', async () => {
      cacheRepository.getNextId.mockResolvedValue(123);
      urlRepository.create.mockResolvedValue({
        id: '1',
        originalUrl: 'http://example.com',
        shortUrl: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.createShortUrl('http://example.com');

      expect(cacheRepository.getNextId).toHaveBeenCalled();
      expect(urlRepository.create).toHaveBeenCalledWith({
        originalUrl: 'http://example.com',
        shortUrl: expect.any(String),
      });
      expect(cacheRepository.setUrlMapping).toHaveBeenCalledWith(
        expect.any(String),
        'http://example.com',
      );
      expect(result).toHaveProperty('fullUrl');
      expect(result.originalUrl).toBe('http://example.com');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return from cache and increment clicks', async () => {
      cacheRepository.getUrlMapping.mockResolvedValue('http://cached.com');

      const result = await service.getOriginalUrl('abc');

      expect(cacheRepository.getUrlMapping).toHaveBeenCalledWith('abc');
      expect(urlRepository.incrementClicks).toHaveBeenCalledWith('abc');
      expect(result).toEqual({
        originalUrl: 'http://cached.com',
        shortUrl: 'abc',
      });
    });

    it('should return from DB when not in cache', async () => {
      cacheRepository.getUrlMapping.mockResolvedValue(null);
      urlRepository.findByShortUrl.mockResolvedValue({
        originalUrl: 'http://db.com',
        shortUrl: 'abc',
      } as any);

      const result = await service.getOriginalUrl('abc');

      expect(urlRepository.findByShortUrl).toHaveBeenCalledWith('abc');
      expect(urlRepository.incrementClicks).toHaveBeenCalledWith('abc');
      expect(cacheRepository.setUrlMapping).toHaveBeenCalledWith('abc', 'http://db.com');
      expect(result).toEqual({
        originalUrl: 'http://db.com',
        shortUrl: 'abc',
      });
    });
    it('should throw NotFoundError when not found', async () => {
      cacheRepository.getUrlMapping = jest.fn().mockResolvedValue(null);
      urlRepository.findByShortUrl = jest.fn().mockResolvedValue(null);
      await expect(service.getOriginalUrl('xyz')).rejects.toEqual(
        expect.objectContaining({
          name: 'NotFoundError',
          statusCode: 404,
          message: 'URL not found',
        }),
      );
    });
  });

  describe('incrementClicks', () => {
    it('should call repository incrementClicks', async () => {
      await service.incrementClicks('abc');
      expect(urlRepository.incrementClicks).toHaveBeenCalledWith('abc');
    });
  });
});

/**What this covers
✅ createShortUrl: ensures ID generation, repository creation, caching, and return object.

✅ getOriginalUrl: tests both cache hit and DB fallback, plus error case.

✅ incrementClicks: verifies delegation to repository.

This way you’re testing the service logic only, not the actual DB/cache implementations.
 */
