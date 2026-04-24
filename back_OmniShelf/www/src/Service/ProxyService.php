<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProductDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

final readonly class ProxyService
{
    private const CHEAPSHARK_BASE_URL = "https://www.cheapshark.com/api/1.0";

    public function __construct(
        private HttpClientInterface $httpClient,
        private CacheInterface $cache,
        private IgdbService $igdbService,
        private string $booksApiKey,
        private string $discogsApi,
    ) {}


    /**
     * Recherche multi-sources avec filtres avancés
     */
    public function search(string $query, string $category = 'all', int $page = 1, int $itemsPerPage = 20, array $filters = []): array
    {
        error_log("--- ProxyService Search Start ---");
        $results = [];

        // 1. Mangas
        if (in_array($category, ['manga', 'book', 'all'])) {
            $this->searchBooks($query, $itemsPerPage, $page, $results);
        }

        // 2. Jeux Vidéo (IGDB avec filtres)
        if (in_array($category, ['game', 'all'])) {
            $this->searchGames($query, $itemsPerPage, $page, $results, $filters);
        }

        // 3. POPs
        if (in_array($category, ['pop', 'all'])) {
            $this->searchPops($query, $itemsPerPage, $page, $results);
        }

        // 4. Vinyles
        if (in_array($category, ['vinyl', 'all'])) {
            $this->searchVinyls($query, $itemsPerPage, $page, $results);
        }

        return $this->deduplicate($results);
    }

    private function searchGames(string $query, int $limit, int $page, array &$results, array $filters = []): void
    {
        error_log("--- ProxyService: searchGames ('$query') ---");
        
        // 1. Essai avec IGDB (Source premium)
        try {
            $igdbResults = $this->igdbService->search($query, $limit);
            if (!empty($igdbResults)) {
                foreach ($igdbResults as $res) {
                    $results[] = $res;
                }
                return;
            }
        } catch (\Exception $e) {
            error_log("IGDB Integration Error: " . $e->getMessage());
        }

        // 2. Fallback sur CheapShark si IGDB ne renvoie rien (et que la requête n'est pas vide)
        if (!empty($query)) {
            try {
                $response = $this->httpClient->request('GET', self::CHEAPSHARK_BASE_URL . "/games", [
                    'query' => [
                        'title' => $query,
                        'limit' => $limit
                    ]
                ]);

                if ($response->getStatusCode() === 200) {
                    $data = $response->toArray();
                    foreach ($data as $item) {
                        $results[] = ProductDto::fromArray([
                            'id' => 'cs-' . (string)$item['gameID'],
                            'title' => $item['external'],
                            'category' => 'game',
                            'imageUrl' => $item['thumb'] ?? null,
                            'metadata' => [
                                'source' => 'cheapshark'
                            ]
                        ]);
                    }
                }
            } catch (\Exception $e) {
                error_log("CheapShark Search Error: " . $e->getMessage());
            }
        }
    }


    private function searchBooks(string $query, int $limit, int $page, array &$results): void
    {
        try {
            $apiKey = $_SERVER['BOOKS_API_KEY'] ?? getenv('BOOKS_API_KEY');
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes", [
                'query' => [
                    'q' => "subject:manga {$query}",
                    'maxResults' => $limit,
                    'startIndex' => ($page - 1) * $limit,
                    'key' => $this->booksApiKey
                ]
            ]);
            if ($response->getStatusCode() === 200) {
                foreach ($response->toArray()['items'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => $item['id'],
                        'title' => $item['volumeInfo']['title'] ?? 'Sans titre',
                        'category' => 'manga',
                        'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                        'rating' => $item['volumeInfo']['averageRating'] ?? null,
                        'author' => ($item['volumeInfo']['authors'] ?? [])[0] ?? null,
                    ]);
                }
            }
        } catch (\Exception $e) { error_log("Books Error: " . $e->getMessage()); }
    }

    private function searchPops(string $query, int $limit, int $page, array &$results): void
    {
        $endpoints = ['https://world.openproductsfacts.org/cgi/search.pl', 'https://world.openfoodfacts.org/cgi/search.pl'];
        foreach ($endpoints as $endpoint) {
            try {
                $response = $this->httpClient->request('GET', $endpoint, [
                    'query' => ['search_terms' => $query, 'json' => 1, 'page' => $page, 'page_size' => $limit]
                ]);
                if ($response->getStatusCode() === 200) {
                    foreach ($response->toArray()['products'] ?? [] as $item) {
                        $brand = strtolower($item['brands'] ?? '');
                        if (str_contains($brand, 'funko') || str_contains(strtolower($item['product_name'] ?? ''), 'pop')) {
                            $results[] = ProductDto::fromArray([
                                'id' => $item['code'] ?? $item['_id'],
                                'title' => $item['product_name'] ?? 'Pop Inconnue',
                                'category' => 'pop',
                                'imageUrl' => $item['image_url'] ?? null,
                            ]);
                        }
                    }
                }
            } catch (\Exception $e) { error_log("Pops Error: " . $e->getMessage()); }
        }
    }

    private function searchVinyls(string $query, int $limit, int $page, array &$results): void
    {
        try {
            $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                'query' => ['q' => $query, 'type' => 'release', 'format' => 'vinyl', 'token' => $this->discogsApi, 'page' => $page, 'per_page' => $limit],
                'headers' => ['User-Agent' => 'OmniShelf/1.0']
            ]);
            if ($response->getStatusCode() === 200) {
                foreach ($response->toArray()['results'] ?? [] as $item) {
                    $results[] = ProductDto::fromArray([
                        'id' => (string)$item['id'],
                        'title' => $item['title'],
                        'category' => 'vinyl',
                        'imageUrl' => $item['cover_image'] ?? null,
                    ]);
                }
            }
        } catch (\Exception $e) { error_log("Vinyls Error: " . $e->getMessage()); }
    }

    public function getDetails(string $externalId, string $category): array
    {
        if ($category === 'game') {
            // IGDB Details
            if (str_starts_with($externalId, 'igdb-')) {
                return $this->igdbService->getDetails(str_replace('igdb-', '', $externalId));
            }

            // CheapShark Details
            if (str_starts_with($externalId, 'cs-')) {
                $id = str_replace('cs-', '', $externalId);
                try {
                    $response = $this->httpClient->request('GET', self::CHEAPSHARK_BASE_URL . "/games", [
                        'query' => ['id' => $id]
                    ]);
                    $data = $response->toArray();
                    $info = $data['info'] ?? [];
                    
                    return [
                        'name' => $info['title'] ?? 'Inconnu',
                        'description' => "Prix le plus bas constaté : " . ($data['cheapestPriceEver']['price'] ?? 'N/A') . "€",
                        'backgroundImage' => $info['thumb'] ?? null,
                        'genres' => [['name' => 'Jeu Vidéo']],
                        'platforms' => [['platform' => ['name' => 'PC / Multi']]],
                        'publishers' => [],
                        'rating' => null,
                        'releaseYear' => null,
                        'screenshots' => [],
                        'cheapsharkId' => $id,
                        'deals' => $data['deals'] ?? []
                    ];
                } catch (\Exception $e) { return []; }
            }

            // Fallback Google Books si l'ID correspond
            if (strlen($externalId) > 10 && !is_numeric($externalId)) {
                return $this->getBookDetails($externalId);
            }
        }

        if ($category === 'manga' || $category === 'book') {
            return $this->getBookDetails($externalId);
        }

        if ($category === 'pop') {
            try {
                $response = $this->httpClient->request('GET', "https://world.openproductsfacts.org/api/v0/product/{$externalId}.json");
                $data = $response->toArray();
                $product = $data['product'] ?? null;
                
                if (!$product) return [];

                return [
                    'name' => $product['product_name'] ?? 'Pop Inconnue',
                    'brand' => $product['brands'] ?? 'Funko',
                    'imageUrl' => $product['image_url'] ?? null,
                    'category' => 'pop',
                    'id' => $product['code'] ?? $externalId,
                    'categories' => explode(',', $product['categories'] ?? ''),
                    'metadata' => [
                        'source' => 'openproductsfacts'
                    ]
                ];
            } catch (\Exception $e) { return []; }
        }

        if ($category === 'vinyl') {
            try {
                $response = $this->httpClient->request('GET', "https://api.discogs.com/releases/{$externalId}", [
                    'query' => ['token' => $this->discogsApi],
                    'headers' => ['User-Agent' => 'OmniShelf/1.0']
                ]);
                $data = $response->toArray();

                return [
                    'title' => $data['title'] ?? 'Inconnu',
                    'artist' => $data['artists_sort'] ?? 'Artiste inconnu',
                    'imageUrl' => $data['images'][0]['resource_url'] ?? $data['thumb'] ?? null,
                    'releaseYear' => $data['released'] ?? null,
                    'genres' => $data['genres'] ?? [],
                    'tracklist' => array_map(fn($t) => [
                        'position' => $t['position'],
                        'title' => $t['title'],
                        'duration' => $t['duration']
                    ], $data['tracklist'] ?? []),
                    'id' => (string)$data['id'],
                    'category' => 'vinyl',
                    'metadata' => [
                        'source' => 'discogs'
                    ]
                ];
            } catch (\Exception $e) { return []; }
        }

        return [];
    }


    public function scan(string $ean): ?array
    {
        try {
            $response = $this->httpClient->request('GET', "https://api.upcitemdb.com/prod/trial/lookup", ['query' => ['upc' => $ean]]);
            if ($response->getStatusCode() === 200) {
                $item = $response->toArray()['items'][0] ?? null;
                if ($item) {
                    $title = $item['title'];
                    $imageUrl = $item['images'][0] ?? null;

                    // Essayer de trouver un match sur IGDB pour avoir des données plus riches
                    $igdbResults = $this->igdbService->search($title, 1);
                    if (!empty($igdbResults)) {
                        $game = $igdbResults[0];
                        return [
                            'id' => $game->id, 
                            'title' => $game->title, 
                            'category' => 'game', 
                            'imageUrl' => $game->imageUrl,
                            'year' => $game->year,
                            'metadata' => [
                                'ean' => $ean,
                                'source' => 'igdb'
                            ]
                        ];
                    }

                    return [
                        'id' => $ean, 
                        'title' => $title, 
                        'category' => 'game', 
                        'imageUrl' => $imageUrl,
                        'metadata' => [
                            'source' => 'upcitemdb'
                        ]
                    ];
                }
            }
        } catch (\Exception $e) {}

        try {
            $response = $this->httpClient->request('GET', "https://world.openproductsfacts.org/api/v0/product/{$ean}.json");
            $data = $response->toArray();
            if (isset($data['product'])) {
                return ['id' => $ean, 'title' => $data['product']['product_name'] ?? 'Inconnu', 'category' => 'pop', 'imageUrl' => $data['product']['image_url'] ?? null];
            }
        } catch (\Exception $e) {}

        return null;
    }

    private function deduplicate(array $results): array
    {
        $unique = [];
        $seen = [];
        foreach ($results as $res) {
            $key = $res->category . '-' . $res->id;
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $unique[] = $res;
            }
        }
        return $unique;
    }

    private function getBookDetails(string $externalId): array
    {
        try {
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes/{$externalId}", ['query' => ['key' => $this->booksApiKey]]);
            $data = $response->toArray();
            $vol = $data['volumeInfo'] ?? [];

            return [
                'name' => $vol['title'] ?? 'Inconnu',
                'author' => ($vol['authors'] ?? [])[0] ?? 'Auteur inconnu',
                'description' => $vol['description'] ?? '',
                'backgroundImage' => $vol['imageLinks']['thumbnail'] ?? $vol['imageLinks']['smallThumbnail'] ?? null,
                'rating' => $vol['averageRating'] ?? null,
                'releaseYear' => isset($vol['publishedDate']) ? substr($vol['publishedDate'], 0, 4) : null,
                'publisher' => $vol['publisher'] ?? null,
                'pageCount' => $vol['pageCount'] ?? null,
                'categories' => $vol['categories'] ?? [],
            ];
        } catch (\Exception $e) { return []; }
    }
}
