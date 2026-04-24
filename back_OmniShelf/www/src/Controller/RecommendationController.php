<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\RecommendationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users')]
final class RecommendationController extends AbstractController
{
    public function __construct(
        private readonly RecommendationService $recommendationService,
    ) {}

    #[Route('/{id}/recommendations', name: 'api_users_recommendations', methods: ['GET'])]
    public function recommendations(int $id): JsonResponse
    {
        return $this->json($this->recommendationService->getRecommendationsForUser($id));
    }
}
