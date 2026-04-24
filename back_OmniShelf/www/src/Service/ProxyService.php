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

    /**
     * Effectue une recherche multi-sources (Google Books, RAWG, Discogs, Open Products Facts)
     */
    public function search(string $query, string $category = 'all', int $page = 1, int $itemsPerPage = 20): array
    {
        error_log("Search Query: '{$query}', Category: '{$category}', Page: {$page}");
        $results = [];

        // 1. Google Books (Mangas)
        if (in_array($category, ['manga', 'book', 'all'])) {
            try {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://www.googleapis.com/books/v1/volumes', [
                    'query' => [
                        'q' => "subject:manga {$query}",
                        'maxResults' => $itemsPerPage,
                        'startIndex' => ($page - 1) * $itemsPerPage,
                        'key' => $apiKey
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['items'] ?? [] as $item) {
                    $categories = $item['volumeInfo']['categories'] ?? [];
                    $isManga = false;
                    foreach ($categories as $cat) {
                        if (str_contains(strtolower($cat), 'manga') || str_contains(strtolower($cat), 'comic')) {
                            $isManga = true;
                            break;
                        }
                    }
                    
                    if ($isManga || $category === 'all') {
                        $results[] = ProductDto::fromArray([
                            'id' => $item['id'],
                            'title' => $item['volumeInfo']['title'] ?? 'Sans titre',
                            'category' => 'manga',
                            'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                            'rating' => $item['volumeInfo']['averageRating'] ?? null,
                        ]);
                    }
                }
            } catch (\Exception $e) {
                error_log("Google Books Search Error: " . $e->getMessage());
            }
        }

        // 2. RAWG (Jeux Vidéo)
        if (in_array($category, ['game', 'all'])) {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? $_SERVER['RAWG_API_KEY'] ?? null;
                if (!$apiKey) error_log("CRITICAL: RAWG_API_KEY is missing from ENV and SERVER!");
                
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
                error_log("RAWG Results for '{$query}': " . count($data['results'] ?? []));
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
                $searchQuery = (str_contains(strtolower($query), 'funko') || str_contains(strtolower($query), 'pop')) 
                    ? $query 
                    : "Funko Pop " . $query;

                $response = $this->httpClient->request('GET', 'https://world.openproductsfacts.org/cgi/search.pl', [
                    'query' => [
                        'search_terms' => $query,
                        'tagtype_0' => 'brands',
                        'tag_contains_0' => 'contains',
                        'tag_0' => 'Funko',
                        'search_simple' => 1,
                        'action' => 'process',
                        'json' => 1,
                        'page' => $page,
                        'page_size' => $itemsPerPage
                    ]
                ]);
                $data = $response->toArray();
                error_log("Funko Search for '{$query}': " . count($data['products'] ?? []));
                foreach ($data['products'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => $item['code'] ?? $item['_id'],
                        'title' => $item['product_name'] ?? 'Pop Inconnue',
                        'category' => 'pop',
                        'imageUrl' => $item['image_url'] ?? null,
                        'rating' => null,
                    ]);
                }
            } catch (\Exception $e) {
                error_log("Open Products Facts Search Error: " . $e->getMessage());
            }
        }

        // 4. Discogs (Vinyles)
        if (in_array($category, ['vinyl', 'all'])) {
            try {
                $apiKey = $_ENV['DISCOGS_API'] ?? $_SERVER['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                    'query' => [
                        'q' => $query,
                        'type' => 'release',
                        'format' => 'vinyl',
                        'token' => $apiKey,
                        'page' => $page,
                        'per_page' => $itemsPerPage
                    ],
                    'headers' => ['User-Agent' => 'OmniShelf/1.0']
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => (string)$item['id'],
                        'title' => $item['title'] ?? 'Album inconnu',
                        'category' => 'vinyl',
                        'imageUrl' => $item['cover_image'] ?? null,
                        'rating' => null,
                    ]);
                }
            } catch (\Exception $e) {
                error_log("Discogs Search Error: " . $e->getMessage());
            }
        }

        return $results;
    }

    /**
     * Récupère les détails d'un produit spécifique
     */
    public function getDetails(string $externalId, string $category): array
    {
        if ($category === 'manga' || $category === 'book') {
            try {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes/{$externalId}", [
                    'query' => ['key' => $apiKey]
                ]);
                return $response->toArray();
            } catch (\Exception $e) {
                error_log("Google Books Details Error: " . $e->getMessage());
            }
        }

        if ($category === 'game') {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? $_SERVER['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.rawg.io/api/games/{$externalId}", [
                    'query' => ['key' => $apiKey]
                ]);
                return $response->toArray();
            } catch (\Exception $e) {
                error_log("RAWG Details Error: " . $e->getMessage());
            }
        }

        if ($category === 'pop') {
            try {
                $response = $this->httpClient->request('GET', "https://world.openproductsfacts.org/api/v0/product/{$externalId}.json");
                $data = $response->toArray();
                return $data['product'] ?? $data;
            } catch (\Exception $e) {
                error_log("Open Products Facts Details Error: " . $e->getMessage());
            }
        }

        if ($category === 'vinyl') {
            try {
                $apiKey = $_ENV['DISCOGS_API'] ?? $_SERVER['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.discogs.com/releases/{$externalId}", [
                    'query' => ['token' => $apiKey],
                    'headers' => ['User-Agent' => 'OmniShelf/1.0']
                ]);
                return $response->toArray();
            } catch (\Exception $e) {
                error_log("Discogs Details Error: " . $e->getMessage());
            }
        }

        return [];
    }

    /**
     * Recherche un produit par code-barres
     */
    public function scan(string $ean): ?array
    {
        try {
            $response = $this->httpClient->request('GET', "https://world.openfoodfacts.org/api/v0/product/{$ean}.json");
            $data = $response->toArray();
            if (isset($data['product'])) {
                return [
                    'id' => $ean,
                    'title' => $data['product']['product_name'] ?? 'Inconnu',
                    'category' => 'pop',
                    'imageUrl' => $data['product']['image_url'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            error_log("Scan Error (OpenFoodFacts): " . $e->getMessage());
        }

        try {
            $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes", [
                'query' => [
                    'q' => "isbn:{$ean}",
                    'key' => $apiKey
                ]
            ]);
            $data = $response->toArray();
            if (isset($data['items'][0])) {
                $item = $data['items'][0];
                return [
                    'id' => $item['id'],
                    'title' => $item['volumeInfo']['title'] ?? 'Livre inconnu',
                    'category' => 'manga',
                    'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            error_log("Scan Error (GoogleBooks): " . $e->getMessage());
        }

        return null;
    }
}
