<?php
/*
 * Created At: 2026-04-24
 * Author: Antigravity
 */

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProductDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

final readonly class IgdbService
{
    private const AUTH_URL = 'https://id.twitch.tv/oauth2/token';
    private const API_BASE_URL = 'https://api.igdb.com/v4';

    public function __construct(
        private HttpClientInterface $httpClient,
        private CacheInterface $cache,
        private string $igdbClientId,
        private string $igdbClientSecret,
    ) {}

    /**
     * Get OAuth token from Twitch with caching
     */
    private function getAccessToken(): string
    {
        return $this->cache->get('igdb_access_token', function (ItemInterface $item): string {
            $response = $this->httpClient->request('POST', self::AUTH_URL, [
                'query' => [
                    'client_id' => $this->igdbClientId,
                    'client_secret' => $this->igdbClientSecret,
                    'grant_type' => 'client_credentials',
                ],
            ]);

            $data = $response->toArray();
            
            // Set expiration to slightly less than the provided expires_in (usually 60 days)
            $item->expiresAfter($data['expires_in'] - 60);

            return $data['access_token'];
        });
    }

    /**
     * Search games via IGDB
     */
    public function search(string $query, int $limit = 10): array
    {
        try {
            $token = $this->getAccessToken();
            
            $body = $query 
                ? sprintf('search "%s"; fields name, cover.url, first_release_date, total_rating; limit %d;', addslashes($query), $limit)
                : sprintf('fields name, cover.url, first_release_date, total_rating; where total_rating_count > 50; sort total_rating desc; limit %d;', $limit);

            $response = $this->httpClient->request('POST', self::API_BASE_URL . '/games', [
                'headers' => [
                    'Client-ID' => $this->igdbClientId,
                    'Authorization' => 'Bearer ' . $token,
                ],
                'body' => $body,
            ]);

            if ($response->getStatusCode() !== 200) {
                return [];
            }

            $results = [];
            foreach ($response->toArray() as $item) {
                $results[] = ProductDto::fromArray([
                    'id' => 'igdb-' . (string)$item['id'],
                    'title' => $item['name'],
                    'category' => 'game',
                    'imageUrl' => isset($item['cover']['url']) 
                        ? 'https:' . str_replace('t_thumb', 't_cover_big', $item['cover']['url']) 
                        : null,
                    'rating' => isset($item['total_rating']) ? (float)$item['total_rating'] / 10 : null,
                    'year' => isset($item['first_release_date']) 
                        ? (string)date('Y', $item['first_release_date']) 
                        : null,
                    'metadata' => [
                        'source' => 'igdb',
                        'igdb_id' => $item['id']
                    ]
                ]);
            }

            return $results;
        } catch (\Exception $e) {
            error_log("IGDB Search Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get detailed info for a game
     */
    public function getDetails(string $igdbId): array
    {
        try {
            $token = $this->getAccessToken();
            
            $response = $this->httpClient->request('POST', self::API_BASE_URL . '/games', [
                'headers' => [
                    'Client-ID' => $this->igdbClientId,
                    'Authorization' => 'Bearer ' . $token,
                ],
                'body' => sprintf(
                    'fields name, summary, storyline, cover.url, screenshots.url, videos.video_id, genres.name, platforms.name, involved_companies.company.name, first_release_date, total_rating, aggregated_rating; where id = %d;',
                    (int)$igdbId
                ),
            ]);

            $data = $response->toArray();
            if (empty($data)) {
                return [];
            }

            $game = $data[0];
            
            return [
                'name' => $game['name'],
                'description' => $game['summary'] ?? 'Aucune description disponible.',
                'storyline' => $game['storyline'] ?? null,
                'backgroundImage' => isset($game['cover']['url']) 
                    ? 'https:' . str_replace('t_thumb', 't_1080p', $game['cover']['url']) 
                    : null,
                'genres' => array_map(fn($g) => ['name' => $g['name']], $game['genres'] ?? []),
                'platforms' => array_map(fn($p) => ['platform' => ['name' => $p['name']]], $game['platforms'] ?? []),
                'publishers' => array_map(fn($c) => ['publisher' => ['name' => $c['company']['name']]], $game['involved_companies'] ?? []),
                'rating' => isset($game['total_rating']) ? (float)$game['total_rating'] / 10 : null,
                'metacritic' => isset($game['aggregated_rating']) ? (int)$game['aggregated_rating'] : null,
                'releaseYear' => isset($game['first_release_date']) ? (string)date('Y', $game['first_release_date']) : null,
                'screenshots' => array_map(fn($s) => 'https:' . str_replace('t_thumb', 't_1080p', $s['url']), $game['screenshots'] ?? []),
                'videos' => array_map(fn($v) => 'https://www.youtube.com/embed/' . $v['video_id'], $game['videos'] ?? []),
                'igdbId' => $game['id']
            ];
        } catch (\Exception $e) {
            error_log("IGDB Details Error: " . $e->getMessage());
            return [];
        }
    }
}
