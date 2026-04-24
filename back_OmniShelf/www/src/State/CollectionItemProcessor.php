<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\HttpOperation;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\CollectionItem;
use App\Entity\User;
use App\Service\ProxyService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Processeur pour enrichir les items de collection avec les métadonnées du proxy
 */
final readonly class CollectionItemProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private ProxyService $proxyService,
        private \Doctrine\ORM\EntityManagerInterface $entityManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof \App\Dto\CollectionItemInput && $operation instanceof HttpOperation && $operation->getMethod() === 'POST') {
            $user = $this->security->getUser();
            if (!$user instanceof User) {
                throw new \Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException("Vous devez être connecté.");
            }

            $entity = new CollectionItem();
            $entity->setUser($user);
            $entity->setExternalProductId($data->externalProductId);
            $entity->setCategory($data->category);
            $entity->setIsWishlist($data->isWishlist);

            if ($data->collection) {
                $parts = explode('/', $data->collection);
                $colId = (int) end($parts);
                $collection = $this->entityManager->getRepository(\App\Entity\UserCollection::class)->find($colId);
                
                if (!$collection) throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("Collection non trouvée.");
                if ($collection->getUser() !== $user) throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("Cette collection ne vous appartient pas.");
                $entity->setCollection($collection);
            }

            $details = $this->proxyService->getDetails($data->externalProductId, $data->category);
            if (!empty($details)) {
                $entity->setTitle($details['name'] ?? $details['title'] ?? 'Inconnu');
                $entity->setImageUrl($details['backgroundImage'] ?? $details['imageUrl'] ?? null);
                if (isset($details['rating'])) $entity->setRating((float)$details['rating']);
            }

            $this->entityManager->persist($entity);
            $this->entityManager->flush();

            return $entity;
        }

        return $data;
    }
}
