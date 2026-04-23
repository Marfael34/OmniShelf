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
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('f.brand', 'f.barcode')
           ->from(CollectionItem::class, 'ci')
           ->join('ci.figurine', 'f')
           ->where('ci.user = :userId')
           ->setParameter('userId', $userId->toRfc4122());

        $results = $qb->getQuery()->getScalarResult();
        $excludedIds = array_column($results, 'barcode');
        $brands = array_unique(array_filter(array_column($results, 'brand')));

        // 2. Analyser les thèmes (on prend les marques possédées)
        $recommendations = [];
        if (!empty($brands)) {
            $mainBrand = $brands[array_rand($brands)];
            try {
                $response = $this->httpClient->request('GET', 'https://openlibrary.org/search.json', [
                    'query' => ['q' => $mainBrand, 'limit' => 5]
                ]);
                $data = $response->toArray();
                foreach ($data['docs'] ?? [] as $doc) {
                    $recommendations[] = [
                        'title' => $doc['title'] ?? 'Livre suggéré',
                        'category' => 'book',
                        'external_id' => $doc['key'],
                        'reason' => "Basé sur votre intérêt pour $mainBrand"
                    ];
                }
            } catch (\Exception $e) {
                // Silently fail or log
            }
        } else {
            // Cold Start: Fetch popular items
            try {
                $response = $this->httpClient->request('GET', 'https://openlibrary.org/search.json', [
                    'query' => ['q' => 'popular', 'limit' => 5]
                ]);
                $data = $response->toArray();
                foreach ($data['docs'] ?? [] as $doc) {
                    $recommendations[] = [
                        'title' => $doc['title'] ?? 'Populaire',
                        'category' => 'book',
                        'external_id' => $doc['key'],
                        'reason' => "Populaire en ce moment"
                    ];
                }
            } catch (\Exception $e) {
                // Silently fail
            }
        }

        // 3. Fallback final si toujours rien
        if (empty($recommendations)) {
            $recommendations[] = [
                'title' => 'The Legend of Zelda: Breath of the Wild',
                'category' => 'game',
                'external_id' => 'zelda-botw',
                'reason' => 'Indispensable de la communauté'
            ];
        }

        return [
            'user_id' => $userId->toRfc4122(),
            'excluded_ids' => $excludedIds,
            'recommendations' => $recommendations,
        ];
    }
}
