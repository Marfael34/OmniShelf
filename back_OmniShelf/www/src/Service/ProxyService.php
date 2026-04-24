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

        // 2. RAWG (Jeux Vidéo)
        if (in_array($category, ['game', 'all'])) {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games', [
                    'query' => [
                        'search' => $query,
                        'key' => $apiKey,
                        'page' => $page,
                        'page_size' => $itemsPerPage,
                        'search_precise' => true
                    ],
                    'headers' => ['User-Agent' => 'OmniShelf/1.0']
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
                error_log("RAWG Search Error: " . $e->getMessage());
            }
        }

        // 3. Open Products Facts (Funko Pop)
        if (in_array($category, ['pop', 'all'])) {
            try {
                // On ajoute "Funko Pop" à la recherche si ce n'est pas déjà présent pour filtrer
                $searchQuery = (str_contains(strtolower($query), 'funko') || str_contains(strtolower($query), 'pop')) 
                    ? $query 
                    : "Funko Pop " . $query;

                $response = $this->httpClient->request('GET', 'https://world.openproductsfacts.org/cgi/search.pl', [
                    'query' => [
                        'search_terms' => $searchQuery,
                        'search_simple' => 1,
                        'action' => 'process',
                        'json' => 1,
                        'page' => $page,
                        'page_size' => $itemsPerPage
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['products'] ?? [] as $item) {
                    // On ne garde que si c'est vraiment une Funko (filtre basique)
                    if (isset($item['brands']) && str_contains(strtolower($item['brands']), 'funko')) {
                        $results[] = ProductDto::fromArray([
                            'id' => $item['_id'] ?? $item['code'],
                            'title' => $item['product_name'] ?? 'Funko Pop Inconnue',
                            'category' => 'pop',
                            'imageUrl' => $item['image_url'] ?? null,
                            'author' => $item['brands'] ?? 'Funko',
                            'metadata' => [
                                'universe' => $item['categories'] ?? null,
                                'number' => $item['quantity'] ?? null, // Parfois le numéro est là
                            ]
                        ]);
                    }
                }
            } catch (\Exception $e) {
                error_log("Funko Search Error: " . $e->getMessage());
            }
        }

        // 4. Discogs (Vinyles)
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
