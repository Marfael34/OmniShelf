<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProductDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final readonly class ProxyService
{
    private const IGDB_AUTH_URL = "https://id.twitch.tv/oauth2/token";
    private const IGDB_BASE_URL = "https://api.igdb.com/v4";

    public function __construct(
        private HttpClientInterface $httpClient,
    ) {}

    /**
     * Récupère un token d'accès IGDB (Twitch)
     */
    private function getIgdbToken(): ?string
    {
        try {
            $clientId = $_ENV['IGDB_CLIENT_ID'] ?? $_SERVER['IGDB_CLIENT_ID'] ?? null;
            $clientSecret = $_ENV['IGDB_CLIENT_SECRET'] ?? $_SERVER['IGDB_CLIENT_SECRET'] ?? null;

            if (!$clientId || !$clientSecret || $clientSecret === 'A_REMPLIR') return null;

            $response = $this->httpClient->request('POST', self::IGDB_AUTH_URL, [
                'query' => [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'grant_type' => 'client_credentials'
                ]
            ]);

            $data = $response->toArray();
            return $data['access_token'] ?? null;
        } catch (\Exception $e) {
            error_log("IGDB Auth Error: " . $e->getMessage());
            return null;
        }
    }

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
        $token = $this->getIgdbToken();
        $clientId = $_ENV['IGDB_CLIENT_ID'] ?? $_SERVER['IGDB_CLIENT_ID'] ?? null;

        if ($token && $clientId) {
            try {
                $whereClauses = [];
                
                if (!empty($filters['genre'])) {
                    $whereClauses[] = "genres.name = \"{$filters['genre']}\"";
                }
                if (!empty($filters['platform'])) {
                    $whereClauses[] = "platforms.name = \"{$filters['platform']}\"";
                }
                if (!empty($filters['publisher'])) {
                    $whereClauses[] = "involved_companies.company.name ~ *\"{$filters['publisher']}\"*";
                }

                $where = count($whereClauses) > 0 ? "where " . implode(" & ", $whereClauses) . ";" : "";
                $search = !empty($query) ? "search \"{$query}\";" : "";
                
                // Si pas de query mais des filtres, on trie par popularité
                $sort = empty($query) ? "sort total_rating_count desc;" : "";

                $body = "{$search} {$where} {$sort} fields name, cover.url, total_rating, genres.name, platforms.name, involved_companies.company.name, involved_companies.publisher; limit {$limit}; offset " . (($page - 1) * $limit) . ";";
                
                $response = $this->httpClient->request('POST', self::IGDB_BASE_URL . "/games", [
                    'headers' => [
                        'Client-ID' => $clientId,
                        'Authorization' => "Bearer {$token}"
                    ],
                    'body' => $body
                ]);

                if ($response->getStatusCode() === 200) {
                    foreach ($response->toArray() as $item) {
                        $publisher = null;
                        foreach ($item['involved_companies'] ?? [] as $ic) {
                            if ($ic['publisher'] ?? false) {
                                $publisher = $ic['company']['name'];
                                break;
                            }
                        }

                        $results[] = ProductDto::fromArray([
                            'id' => 'igdb-' . $item['id'],
                            'title' => $item['name'],
                            'category' => 'game',
                            'imageUrl' => isset($item['cover']['url']) ? "https:" . str_replace('t_thumb', 't_cover_big', $item['cover']['url']) : null,
                            'rating' => isset($item['total_rating']) ? $item['total_rating'] / 20 : null,
                            'metadata' => [
                                'publisher' => $publisher,
                                'genre' => ($item['genres'] ?? [])[0]['name'] ?? null,
                                'platform' => ($item['platforms'] ?? [])[0]['name'] ?? null,
                            ]
                        ]);
                    }
                    if (count($results) > 0) return;
                } else {
                    error_log("IGDB API Error: " . $response->getStatusCode() . " - " . $response->getContent(false));
                }
            } catch (\Exception $e) { error_log("IGDB Error: " . $e->getMessage()); }
        }

        // Fallback RAWG (inchangé)
        if (!empty($query)) {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? $_SERVER['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games', [
                    'query' => ['search' => $query, 'key' => $apiKey, 'page' => $page, 'page_size' => $limit]
                ]);
                if ($response->getStatusCode() === 200) {
                    foreach ($response->toArray()['results'] ?? [] as $item) {
                        $results[] = ProductDto::fromArray([
                            'id' => (string)$item['id'],
                            'title' => $item['name'],
                            'category' => 'game',
                            'imageUrl' => $item['background_image'] ?? null,
                            'rating' => $item['rating'] ?? null,
                        ]);
                    }
                }
            } catch (\Exception $e) { error_log("RAWG Error: " . $e->getMessage()); }
        }
    }

    private function searchBooks(string $query, int $limit, int $page, array &$results): void
    {
        try {
            $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes", [
                'query' => [
                    'q' => "subject:manga {$query}",
                    'maxResults' => $limit,
                    'startIndex' => ($page - 1) * $limit,
                    'key' => $apiKey
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
            $apiKey = $_ENV['DISCOGS_API'] ?? $_SERVER['DISCOGS_API'] ?? null;
            $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                'query' => ['q' => $query, 'type' => 'release', 'format' => 'vinyl', 'token' => $apiKey, 'page' => $page, 'per_page' => $limit],
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
        if ($category === 'game' && str_starts_with($externalId, 'igdb-')) {
            return $this->getIgdbDetails(str_replace('igdb-', '', $externalId));
        }

        if ($category === 'game') {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? $_SERVER['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.rawg.io/api/games/{$externalId}", ['query' => ['key' => $apiKey]]);
                return $response->toArray();
            } catch (\Exception $e) { return []; }
        }

        if ($category === 'manga' || $category === 'book') {
            try {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes/{$externalId}", ['query' => ['key' => $apiKey]]);
                return $response->toArray();
            } catch (\Exception $e) { return []; }
        }

        if ($category === 'pop') {
            try {
                $response = $this->httpClient->request('GET', "https://world.openproductsfacts.org/api/v0/product/{$externalId}.json");
                $data = $response->toArray();
                return $data['product'] ?? $data;
            } catch (\Exception $e) { return []; }
        }

        if ($category === 'vinyl') {
            try {
                $apiKey = $_ENV['DISCOGS_API'] ?? $_SERVER['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.discogs.com/releases/{$externalId}", ['query' => ['token' => $apiKey], 'headers' => ['User-Agent' => 'OmniShelf/1.0']]);
                return $response->toArray();
            } catch (\Exception $e) { return []; }
        }

        return [];
    }

    private function getIgdbDetails(string $id): array
    {
        $token = $this->getIgdbToken();
        $clientId = $_ENV['IGDB_CLIENT_ID'] ?? $_SERVER['IGDB_CLIENT_ID'] ?? null;
        if (!$token || !$clientId) return [];

        try {
            $body = "fields name, summary, cover.url, genres.name, platforms.name, involved_companies.company.name, involved_companies.publisher, first_release_date, total_rating; where id = {$id};";
            $response = $this->httpClient->request('POST', self::IGDB_BASE_URL . "/games", [
                'headers' => ['Client-ID' => $clientId, 'Authorization' => "Bearer {$token}"],
                'body' => $body
            ]);
            $data = $response->toArray()[0] ?? [];
            
            return [
                'name' => $data['name'] ?? 'Inconnu',
                'description' => $data['summary'] ?? '',
                'background_image' => isset($data['cover']['url']) ? "https:" . str_replace('t_thumb', 't_1080p', $data['cover']['url']) : null,
                'genres' => array_map(fn($g) => ['name' => $g['name']], $data['genres'] ?? []),
                'platforms' => array_map(fn($p) => ['platform' => ['name' => $p['name']]], $data['platforms'] ?? []),
                'publishers' => array_map(fn($c) => ['name' => $c['company']['name']], array_filter($data['involved_companies'] ?? [], fn($ic) => $ic['publisher'] ?? false)),
                'rating' => isset($data['total_rating']) ? $data['total_rating'] / 20 : null,
            ];
        } catch (\Exception $e) { return []; }
    }

    public function scan(string $ean): ?array
    {
        $token = $this->getIgdbToken();
        $clientId = $_ENV['IGDB_CLIENT_ID'] ?? $_SERVER['IGDB_CLIENT_ID'] ?? null;
        if ($token && $clientId) {
            try {
                $body = "fields game.name, game.cover.url; where uid = \"{$ean}\" & category = 26;";
                $response = $this->httpClient->request('POST', self::IGDB_BASE_URL . "/external_games", [
                    'headers' => ['Client-ID' => $clientId, 'Authorization' => "Bearer {$token}"],
                    'body' => $body
                ]);
                $ext = $response->toArray()[0] ?? null;
                if ($ext && isset($ext['game'])) {
                    return [
                        'id' => 'igdb-' . $ext['game']['id'],
                        'title' => $ext['game']['name'],
                        'category' => 'game',
                        'imageUrl' => isset($ext['game']['cover']['url']) ? "https:" . str_replace('t_thumb', 't_cover_big', $ext['game']['cover']['url']) : null,
                    ];
                }
            } catch (\Exception $e) {}
        }

        try {
            $response = $this->httpClient->request('GET', "https://api.upcitemdb.com/prod/trial/lookup", ['query' => ['upc' => $ean]]);
            if ($response->getStatusCode() === 200) {
                $item = $response->toArray()['items'][0] ?? null;
                if ($item) {
                    return ['id' => $ean, 'title' => $item['title'], 'category' => 'game', 'imageUrl' => $item['images'][0] ?? null];
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
}
