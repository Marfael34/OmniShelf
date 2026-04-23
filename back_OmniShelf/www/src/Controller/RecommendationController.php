<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\RecommendationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/api/users')]
final class RecommendationController extends AbstractController
{
    public function __construct(
        private readonly RecommendationService $recommendationService,
    ) {}

    #[Route('/{id}/recommendations', name: 'api_users_recommendations', methods: ['GET'])]
    public function recommendations(string $id): JsonResponse
    {
        $userId = Uuid::fromString($id);
        return $this->json($this->recommendationService->getRecommendationsForUser($userId));
    }
}
