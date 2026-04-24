<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\UserCollectionInput;
use App\Entity\UserCollection;
use App\Entity\User;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Processeur pour transformer le DTO UserCollectionInput en entité UserCollection
 * Respecte la règle 185 (DTO + ObjectMapper/State Processor)
 */
final readonly class UserCollectionProcessor implements ProcessorInterface
{
    public function __construct(
        private \Doctrine\ORM\EntityManagerInterface $entityManager,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof UserCollectionInput) {
            $user = $this->security->getUser();
            if (!$user instanceof User) {
                throw new \Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException("Vous devez être connecté.");
            }

            $entity = new UserCollection();
            $entity->setName($data->name);
            $entity->setUser($user);

            $this->entityManager->persist($entity);
            $this->entityManager->flush();

            return $entity;
        }

        return $data; // Devrait être géré par le fournisseur par défaut si pas un DTO
    }
}
