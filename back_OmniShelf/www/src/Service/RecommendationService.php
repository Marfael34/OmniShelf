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

        return [
            'user_id' => $userId->toRfc4122(),
            'excluded_ids' => [],
            'recommendations' => [], // Liste des produits suggérés
        ];
    }
}
