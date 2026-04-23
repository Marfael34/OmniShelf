<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProductDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final readonly class ProxyService
{
    public function __construct(
        private HttpClientInterface $httpClient,
    ) {}

    public function search(string $query, string $category, int $page, int $itemsPerPage): array
    {
        $results = [];

        // 1. Google Books
        if (in_array($category, ['manga', 'book', 'all'])) {
            try {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://www.googleapis.com/books/v1/volumes', [
                    'query' => [
                        'q' => $query,
                        'maxResults' => $itemsPerPage,
                        'startIndex' => ($page - 1) * $itemsPerPage,
                        'key' => $apiKey
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['items'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => $item['id'],
                        'title' => $item['volumeInfo']['title'] ?? 'Sans titre',
                        'category' => 'manga',
                        'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                        'author' => $item['volumeInfo']['authors'][0] ?? 'Inconnu',
                    ]);
                }
            } catch (\Exception $e) {
            }
        }

        // 2. RAWG
        if (in_array($category, ['game', 'all'])) {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games', [
                    'query' => [
                        'search' => $query,
                        'key' => $apiKey,
                        'page' => $page,
                        'page_size' => $itemsPerPage
                    ],
                    'headers' => [
                        'User-Agent' => 'OmniShelf/1.0'
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => (string)$item['id'],
                        'title' => $item['name'] ?? 'Sans titre',
                        'category' => 'game',
                        'imageUrl' => $item['background_image'] ?? null,
                        'rating' => $item['rating'] ?? null,
                    ]);
                }
            } catch (\Exception $e) {
                error_log("RAWG Exception: " . $e->getMessage());
            }
        }

        // 3. Discogs
        if (in_array($category, ['vinyl', 'all'])) {
            try {
                $token = $_ENV['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                    'query' => [
                        'q' => $query,
                        'type' => 'release',
                        'format' => 'vinyl',
                        'token' => $token,
                        'page' => $page,
                        'per_page' => $itemsPerPage
                    ],
                    'headers' => ['User-Agent' => 'OmniShelfApp/1.0']
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => (string)$item['id'],
                        'title' => $item['title'] ?? 'Sans titre',
                        'category' => 'vinyl',
                        'imageUrl' => $item['cover_image'] ?? null,
                        'year' => $item['year'] ?? null,
                    ]);
                }
            } catch (\Exception $e) {
            }
        }

        return $results;
    }

    public function getDetails(string $externalId, string $category): ?array
    {
        try {
            if ($category === 'game') {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.rawg.io/api/games/{$externalId}", [
                    'query' => ['key' => $apiKey]
                ]);
                return $response->toArray();
            }

            if ($category === 'vinyl') {
                $token = $_ENV['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.discogs.com/releases/{$externalId}", [
                    'query' => ['token' => $token],
                    'headers' => ['User-Agent' => 'OmniShelfApp/1.0']
                ]);
                return $response->toArray();
            }

            if (in_array($category, ['manga', 'book'])) {
                $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes/{$externalId}");
                return $response->toArray();
            }
        } catch (\Exception $e) {
        }

        return null;
    }

    public function scan(string $ean): ?ProductDto
    {
        try {
            // Google Books
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes", [
                'query' => ['q' => "isbn:{$ean}"]
            ]);
            $data = $response->toArray();
            if (($data['totalItems'] ?? 0) > 0) {
                $item = $data['items'][0];
                return ProductDto::fromArray([
                    'id' => $item['id'],
                    'title' => $item['volumeInfo']['title'],
                    'category' => 'manga',
                    'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                ]);
            }

            // Discogs
            $token = $_ENV['DISCOGS_API'] ?? null;
            $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                'query' => ['barcode' => $ean, 'token' => $token],
                'headers' => ['User-Agent' => 'OmniShelfApp/1.0']
            ]);
            $data = $response->toArray();
            if (!empty($data['results'])) {
                $item = $data['results'][0];
                return ProductDto::fromArray([
                    'id' => (string)$item['id'],
                    'title' => $item['title'],
                    'category' => 'vinyl',
                    'imageUrl' => $item['cover_image'] ?? null,
                ]);
            }
        } catch (\Exception $e) {
        }

        return null;
    }
}
