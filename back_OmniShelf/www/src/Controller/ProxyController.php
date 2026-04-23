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

        // TODO: Appeler l'API tierce (RAWG, OpenProducts, etc.) avec $this->httpClient
        // En attendant, on retourne la structure standard validée par le front.
        return $this->json([
            'data' => []
        ]);
    }

    #[Route('/details', name: 'api_proxy_details', methods: ['GET'])]
    public function details(Request $request): JsonResponse
    {
        $externalId = $request->query->getString('external_id');
        $category = $request->query->getString('category', 'all');

        return $this->json(['data' => null]);
    }
}
