<?php

namespace App\Controller;

use App\Entity\Figurine;
use App\Repository\FigurineRepository;
use App\Service\BarcodeLookupService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class FunkoController extends AbstractController
{
    #[Route('/scan/{barcode}', name: 'api_scan_funko', methods: ['GET'])]
    public function scan(
        string $barcode,
        BarcodeLookupService $barcodeLookup,
        FigurineRepository $figurineRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // 1. Logique de cache : Chercher d'abord dans la base locale
        $figurine = $figurineRepository->findOneBy(['barcode' => $barcode]);

        if ($figurine) {
            return $this->json([
                'id' => $figurine->getId(),
                'barcode' => $figurine->getBarcode(),
                'name' => $figurine->getName(),
                'brand' => $figurine->getBrand(),
                'description' => $figurine->getDescription(),
                'image_url' => $figurine->getImageUrl(),
                'source' => 'local_cache'
            ]);
        }

        // 2. Cache miss : Appel à l'API externe
        $funkoData = $barcodeLookup->findFunkoByBarcode($barcode);

        if (!$funkoData) {
            return $this->json(['error' => 'Figurine non trouvée.'], 404);
        }

        // 3. Persistance : Créer la nouvelle figurine en base
        $newFigurine = new Figurine();
        $newFigurine->setBarcode($barcode);
        $newFigurine->setName($funkoData['name'] ?? 'Inconnu');
        $newFigurine->setBrand($funkoData['brand'] ?? null);
        $newFigurine->setDescription($funkoData['description'] ?? null);
        $newFigurine->setImageUrl($funkoData['image_url'] ?? null);

        $entityManager->persist($newFigurine);
        $entityManager->flush();

        return $this->json(array_merge(['id' => $newFigurine->getId(), 'source' => 'api_externe'], $funkoData));
    }
}
