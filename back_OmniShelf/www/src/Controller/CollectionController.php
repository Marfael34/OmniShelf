<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\CollectionItem;
use App\Entity\Figurine;
use App\Entity\User;
use App\Repository\CollectionItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/collection')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class CollectionController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CollectionItemRepository $collectionRepository
    ) {}

    #[Route('', name: 'api_collection_get', methods: ['GET'])]
    public function getCollection(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $items = $this->collectionRepository->findBy(['user' => $user]);

        $data = array_map(function (CollectionItem $item) {
            $figurine = $item->getFigurine();
            return [
                'id' => $item->getId(),
                'added_at' => $item->getAddedAt()->format('Y-m-d H:i:s'),
                'figurine' => [
                    'id' => $figurine->getId(),
                    'barcode' => $figurine->getBarcode(),
                    'name' => $figurine->getName(),
                    'image_url' => $figurine->getImageUrl(),
                ]
            ];
        }, $items);

        return $this->json($data);
    }

    #[Route('', name: 'api_collection_add', methods: ['POST'])]
    public function addItem(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $figurineId = $data['figurine_id'] ?? null;

        $figurine = $figurineId ? $this->entityManager->getRepository(Figurine::class)->find($figurineId) : null;
        if (!$figurine) {
            return $this->json(['error' => 'Figurine non trouvée.'], 404);
        }

        /** @var User $user */
        $user = $this->getUser();
        if ($this->collectionRepository->findOneBy(['user' => $user, 'figurine' => $figurine])) {
            return $this->json(['error' => 'Figurine déjà dans la collection.'], 409);
        }

        $item = new CollectionItem();
        $item->setUser($user)->setFigurine($figurine);
        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return $this->json(['message' => 'Ajouté à la collection.', 'id' => $item->getId()], 201);
    }

    #[Route('/{id}', name: 'api_collection_delete', methods: ['DELETE'])]
    public function removeItem(string $id): JsonResponse
    {
        $item = $this->collectionRepository->find($id);
        if ($item && $item->getUser() === $this->getUser()) {
            $this->entityManager->remove($item);
            $this->entityManager->flush();
        }
        return $this->json(['message' => 'Supprimé avec succès.']);
    }
}
