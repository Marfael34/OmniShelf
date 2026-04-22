<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class BarcodeLookupService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ) {}

    /**
     * Recherche une figurine via Open Products Facts (Illimité)
     */
    public function findFunkoByBarcode(string $barcode): ?array
    {
        try {
            // Appel à l'API Open Products Facts (pas de clé d'API requise)
            $response = $this->httpClient->request(
                'GET',
                sprintf('https://world.openproductsfacts.org/api/v0/product/%s.json', $barcode)
            );

            $data = $response->toArray();

            // Vérifie si le produit a été trouvé (status 1)
            if (($data['status'] ?? 0) === 1 && isset($data['product'])) {
                $product = $data['product'];

                return [
                    'name' => $product['product_name'] ?? 'Nom inconnu',
                    'brand' => $product['brands'] ?? 'Funko',
                    'description' => $product['categories'] ?? '',
                    'image_url' => $product['image_url'] ?? null,
                ];
            }
        } catch (TransportExceptionInterface $e) {
            // Journalisation de l'erreur pour le débogage
            $this->logger->error('Erreur de communication avec OpenProductsFacts : ' . $e->getMessage());
        }

        return null; // Aucun produit trouvé ou erreur
    }
}
