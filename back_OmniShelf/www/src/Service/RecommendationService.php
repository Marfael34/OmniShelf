<?php

declare(strict_types=1);

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

final readonly class RecommendationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function getRecommendationsForUser(Uuid $userId): array
    {
        // 1. Récupérer les items de la collection de l'utilisateur (live data)
        // 2. Extraire les tags/catégories majeurs
        // 3. Exclure de la future requête API les 'external_product_id' possédés
        
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('f.barcode')
           ->from(\App\Entity\CollectionItem::class, 'ci')
           ->join('ci.figurine', 'f')
           ->where('ci.user = :userId')
           ->setParameter('userId', $userId->toRfc4122());

        $results = $qb->getQuery()->getScalarResult();
        $excludedIds = array_column($results, 'barcode');

        // TODO: Algorithme d'analyse des tags/genres
        $recommendations = [
            ['title' => 'Recommandation basée sur votre collection', 'category' => 'mixed', 'external_id' => 'mock_rec_1']
        ];

        return [
            'user_id' => $userId->toRfc4122(),
            'excluded_ids' => $excludedIds,
            'recommendations' => $recommendations, // Liste des produits suggérés
        ];
    }
}
