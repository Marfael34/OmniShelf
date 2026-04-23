<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/proxy')]
final class ProxyController extends AbstractController
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {}

    #[Route('/search', name: 'api_proxy_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->getString('query');
        $category = $request->query->getString('category', 'all');
        $page = $request->query->getInt('page', 1);
        $itemsPerPage = 10;

        if (!$query) {
            return $this->json(['data' => []]);
        }

        $results = [];

        // 1. Google Books (Manga / Books)
        if ($category === 'manga' || $category === 'book' || $category === 'all') {
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
                    $results[] = [
                        'id' => $item['id'],
                        'externalProductId' => $item['id'],
                        'title' => $item['volumeInfo']['title'] ?? 'Sans titre',
                        'category' => 'manga',
                        'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                        'author' => $item['volumeInfo']['authors'][0] ?? 'Inconnu',
                    ];
                }
            } catch (\Exception $e) {}
        }

        // 2. RAWG (Games)
        if ($category === 'game' || $category === 'all') {
            try {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games', [
                    'query' => [
                        'search' => $query,
                        'key' => $apiKey,
                        'page' => $page,
                        'page_size' => $itemsPerPage
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $results[] = [
                        'id' => (string)$item['id'],
                        'externalProductId' => (string)$item['id'],
                        'title' => $item['name'] ?? 'Sans titre',
                        'category' => 'game',
                        'imageUrl' => $item['background_image'] ?? null,
                        'rating' => $item['rating'] ?? null,
                    ];
                }
            } catch (\Exception $e) {}
        }

        // 3. Discogs (Vinyls)
        if ($category === 'vinyl' || $category === 'all') {
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
                    'headers' => [
                        'User-Agent' => 'OmniShelfApp/1.0'
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $results[] = [
                        'id' => (string)$item['id'],
                        'externalProductId' => (string)$item['id'],
                        'title' => $item['title'] ?? 'Sans titre',
                        'category' => 'vinyl',
                        'imageUrl' => $item['cover_image'] ?? null,
                        'year' => $item['year'] ?? null,
                    ];
                }
            } catch (\Exception $e) {}
        }

        return $this->json([
            'data' => $results,
            'page' => $page,
            'hasMore' => count($results) >= $itemsPerPage
        ]);
    }

    #[Route('/details', name: 'api_proxy_details', methods: ['GET'])]
    public function details(Request $request): JsonResponse
    {
        $externalId = $request->query->getString('external_id');
        $category = $request->query->getString('category');

        if (!$externalId || !$category) {
            return $this->json(['error' => 'Paramètres manquants'], 400);
        }

        try {
            if ($category === 'game') {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.rawg.io/api/games/{$externalId}", [
                    'query' => ['key' => $apiKey]
                ]);
                return $this->json(['data' => $response->toArray()]);
            }

            if ($category === 'vinyl') {
                $token = $_ENV['DISCOGS_API'] ?? null;
                $response = $this->httpClient->request('GET', "https://api.discogs.com/releases/{$externalId}", [
                    'query' => ['token' => $token],
                    'headers' => ['User-Agent' => 'OmniShelfApp/1.0']
                ]);
                return $this->json(['data' => $response->toArray()]);
            }

            if ($category === 'manga' || $category === 'book') {
                $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes/{$externalId}");
                return $this->json(['data' => $response->toArray()]);
            }
        } catch (\Exception $e) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        return $this->json(['data' => null]);
    }

    #[Route('/scan', name: 'api_proxy_scan', methods: ['GET'])]
    public function scan(Request $request): JsonResponse
    {
        $ean = $request->query->getString('ean');

        if (!$ean) {
            return $this->json(['error' => 'Code-barres manquant'], 400);
        }

        try {
            // Tentative Google Books via ISBN
            $response = $this->httpClient->request('GET', "https://www.googleapis.com/books/v1/volumes", [
                'query' => ['q' => "isbn:{$ean}"]
            ]);
            $data = $response->toArray();
            
            if (($data['totalItems'] ?? 0) > 0) {
                $item = $data['items'][0];
                return $this->json(['data' => [
                    'externalProductId' => $item['id'],
                    'title' => $item['volumeInfo']['title'],
                    'category' => 'manga',
                    'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                ]]);
            }

            // Fallback Discogs si possible (recherche par barcode)
            $token = $_ENV['DISCOGS_API'] ?? null;
            $response = $this->httpClient->request('GET', 'https://api.discogs.com/database/search', [
                'query' => [
                    'barcode' => $ean,
                    'token' => $token
                ],
                'headers' => ['User-Agent' => 'OmniShelfApp/1.0']
            ]);
            $data = $response->toArray();
            if (!empty($data['results'])) {
                $item = $data['results'][0];
                return $this->json(['data' => [
                    'externalProductId' => (string)$item['id'],
                    'title' => $item['title'],
                    'category' => 'vinyl',
                    'imageUrl' => $item['cover_image'] ?? null,
                ]]);
            }

            return $this->json(['error' => 'Produit introuvable'], 404);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur réseau ou API tierce'], 502);
        }
    }
}
