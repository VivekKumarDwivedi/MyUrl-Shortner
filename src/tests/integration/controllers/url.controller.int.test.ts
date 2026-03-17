// tests/urlController.int.test.ts
import request from "supertest";
import express from "express";
import { redirectUrl } from "../../../controllers/url.controller";
import { UrlService } from "../../../services/url.service";
import { NotFoundError } from "../../../utils/errors/app.error";

jest.mock("../../../services/url.service");

const app = express();
app.use(express.json());

const mockUrlService = UrlService as jest.MockedClass<typeof UrlService>;

// Routes for testing
app.post("/api/url", async (req, res, next) => {
  try {
    const result = await mockUrlService.prototype.createShortUrl(req.body.originalUrl);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

app.get("/api/url/:shortUrl", async (req, res, next) => {
  try {
    const result = await mockUrlService.prototype.getOriginalUrl(req.params.shortUrl);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

app.get("/r/:shortUrl", redirectUrl);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.statusCode || 500).json({
     message: err.message
     });
});

describe("URL Controller Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a short URL", async () => {
    mockUrlService.prototype.createShortUrl.mockResolvedValue({
      id: 1,
      shortUrl: "abc123",
      originalUrl: "https://example.com",
      fullUrl: "http://localhost/r/abc123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/api/url")
      .send({ originalUrl: "https://example.com" });

    expect(response.status).toBe(201);
    expect(response.body.shortUrl).toBe("abc123");
  });

  it("should retrieve original URL", async () => {
    mockUrlService.prototype.getOriginalUrl.mockResolvedValue({
      shortUrl: "abc123",
      originalUrl: "https://example.com",
    });

    const response = await request(app).get("/api/url/abc123");

    expect(response.status).toBe(200);
    expect(response.body.originalUrl).toBe("https://example.com");
  });

  it("should redirect to original URL", async () => {
    mockUrlService.prototype.getOriginalUrl.mockResolvedValue({
      shortUrl: "abc123",
      originalUrl: "https://example.com",
    });

    const response = await request(app).get("/r/abc123");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("https://example.com");
  });

  it("should return 404 if short URL not found", async () => {
    mockUrlService.prototype.getOriginalUrl.mockRejectedValue(new NotFoundError("URL not found"));

    const response = await request(app).get("/r/unknown");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("URL not found");
  });
});
