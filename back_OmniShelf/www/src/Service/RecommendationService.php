<?php

declare(strict_types=1);

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Entity\CollectionItem;

final readonly class RecommendationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HttpClientInterface $httpClient,
        private ProxyService $proxyService,
        private IgdbService $igdbService,
    ) {}

    public function getRecommendationsForUser(int $userId): array
    {
        error_log("Getting recommendations for user: {$userId}");
        
        // 1. Récupérer les items de la collection de l'utilisateur
        $collectionItems = $this->entityManager->getRepository(CollectionItem::class)->findBy(['user' => $userId]);

        $categories = [];
        foreach ($collectionItems as $item) {
            $categories[] = $item->getCategory();
        }

        // Fréquence des catégories
        $categoryCounts = array_count_values($categories);
        arsort($categoryCounts);
        $topCategory = !empty($categoryCounts) ? array_key_first($categoryCounts) : 'all';

        error_log("Top category for user {$userId}: {$topCategory}");

        $recommendations = [];

        try {
            if ($topCategory === 'game' || $topCategory === 'all') {
                // Get IGDB IDs from user's game collection
                $igdbIds = [];
                foreach ($collectionItems as $item) {
                    if ($item->getCategory() === 'game' && str_starts_with($item->getExternalProductId(), 'igdb-')) {
                        $igdbIds[] = str_replace('igdb-', '', $item->getExternalProductId());
                    }
                }

                $gameResults = $this->igdbService->getRecommendations($igdbIds, 5);
                foreach ($gameResults as $product) {
                    $recommendations[] = [
                        'id' => $product->id,
                        'externalProductId' => $product->id,
                        'title' => $product->title,
                        'category' => 'game',
                        'imageUrl' => $product->imageUrl,
                        'reason' => empty($igdbIds) ? "Les jeux les plus populaires du moment" : "Basé sur vos genres préférés"
                    ];
                }
            }

            if ($topCategory === 'manga' || $topCategory === 'book' || $topCategory === 'all') {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? $_SERVER['BOOKS_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://www.googleapis.com/books/v1/volumes', [
                    'query' => [
                        'q' => 'subject:manga',
                        'orderBy' => 'relevance',
                        'maxResults' => 5,
                        'key' => $apiKey
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['items'] ?? [] as $item) {
                    $recommendations[] = [
                        'id' => $item['id'],
                        'externalProductId' => $item['id'],
                        'title' => $item['volumeInfo']['title'] ?? 'Manga suggéré',
                        'category' => 'manga',
                        'imageUrl' => $item['volumeInfo']['imageLinks']['thumbnail'] ?? null,
                        'reason' => "Basé sur votre collection de mangas"
                    ];
                }
            }
        } catch (\Exception $e) {
            error_log("Recommendation Error for user {$userId}: " . $e->getMessage());
        }

        // Fallback final si vide
        if (empty($recommendations)) {
            $recommendations[] = [
                'externalProductId' => 'zelda-botw',
                'title' => 'The Legend of Zelda: Breath of the Wild',
                'category' => 'game',
                'reason' => 'Indispensable de la communauté'
            ];
        }

        return [
            'userId' => $userId,
            'recommendations' => $recommendations,
        ];
    }
}
