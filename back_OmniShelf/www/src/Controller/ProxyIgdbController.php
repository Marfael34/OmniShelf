<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\IgdbService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/proxy/igdb')]
final class ProxyIgdbController extends AbstractController
{
    public function __construct(
        private readonly IgdbService $igdbService,
    ) {}

    #[Route('/search', name: 'api_proxy_igdb_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->getString('query');
        $limit = $request->query->getInt('limit', 10);

        if (!$query) {
            return $this->json(['data' => []]);
        }

        try {
            $results = $this->igdbService->search($query, $limit);

            return $this->json([
                'data' => $results,
                'count' => count($results)
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/details', name: 'api_proxy_igdb_details', methods: ['GET'])]
    public function details(Request $request): JsonResponse
    {
        $externalId = $request->query->getString('external_id');

        if (!$externalId) {
            return $this->json(['error' => 'Paramètre external_id manquant'], 400);
        }

        // Clean ID if it has prefix
        $igdbId = str_replace('igdb-', '', $externalId);

        try {
            $data = $this->igdbService->getDetails($igdbId);

            if (empty($data)) {
                return $this->json(['error' => 'Jeu non trouvé sur IGDB'], 404);
            }

            return $this->json(['data' => $data]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/scan', name: 'api_proxy_igdb_scan', methods: ['GET'])]
    public function scan(Request $request): JsonResponse
    {
        return $this->json([
            'error' => 'Le scan direct par code-barres n\'est pas supporté nativement par IGDB.',
            'message' => 'Utilisez la recherche par titre ou une API de mapping tiers.'
        ], 501);
    }
}
