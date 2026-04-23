<?php

declare(strict_types=1);

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Entity\CollectionItem;

final readonly class RecommendationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HttpClientInterface $httpClient,
    ) {}

    public function getRecommendationsForUser(Uuid $userId): array
    {
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

        $recommendations = [];

        try {
            if ($topCategory === 'game' || $topCategory === 'all') {
                $apiKey = $_ENV['RAWG_API_KEY'] ?? null;
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games', [
                    'query' => [
                        'key' => $apiKey,
                        'ordering' => '-rating',
                        'page_size' => 5
                    ]
                ]);
                $data = $response->toArray();
                foreach ($data['results'] ?? [] as $item) {
                    $recommendations[] = [
                        'id' => (string)$item['id'],
                        'externalProductId' => (string)$item['id'],
                        'title' => $item['name'] ?? 'Jeu suggéré',
                        'category' => 'game',
                        'imageUrl' => $item['background_image'] ?? null,
                        'reason' => "Parce que vous aimez les jeux vidéo"
                    ];
                }
            }

            if ($topCategory === 'manga' || $topCategory === 'book' || $topCategory === 'all') {
                $apiKey = $_ENV['BOOKS_API_KEY'] ?? null;
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
            // Log error
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
            'userId' => $userId->toRfc4122(),
            'recommendations' => $recommendations,
        ];
    }
}

