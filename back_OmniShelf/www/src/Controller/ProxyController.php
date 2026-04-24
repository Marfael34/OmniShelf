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
        private readonly \App\Service\ProxyService $proxyService,
    ) {}

    #[Route('/search', name: 'api_proxy_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->getString('query');
        $category = $request->query->getString('category', 'all');
        $page = $request->query->getInt('page', 1);
        $itemsPerPage = 10;
        
        $filters = [
            'publisher' => $request->query->get('publisher'),
            'genre' => $request->query->get('genre'),
            'platform' => $request->query->get('platform'),
        ];

        if (!$query && empty(array_filter($filters))) {
            return $this->json(['data' => []]);
        }

        try {
            $results = $this->proxyService->search($query, $category, $page, $itemsPerPage, $filters);

            return $this->json([
                'data' => $results,
                'page' => $page,
                'hasMore' => count($results) >= $itemsPerPage
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    #[Route('/details', name: 'api_proxy_details', methods: ['GET'])]
    public function details(Request $request): JsonResponse
    {
        $externalId = $request->query->getString('external_id');
        $category = $request->query->getString('category');

        if (!$externalId || !$category) {
            return $this->json(['error' => 'Paramètres manquants'], 400);
        }

        $data = $this->proxyService->getDetails($externalId, $category);

        if (!$data) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        return $this->json(['data' => $data]);
    }

    #[Route('/scan', name: 'api_proxy_scan', methods: ['GET'])]
    public function scan(Request $request): JsonResponse
    {
        $ean = $request->query->getString('ean');

        if (!$ean) {
            return $this->json(['error' => 'Code-barres manquant'], 400);
        }

        $product = $this->proxyService->scan($ean);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], 404);
        }

        return $this->json(['data' => $product]);
    }
}
