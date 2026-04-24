<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\UserCollectionInput;
use App\Entity\UserCollection;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Processeur pour transformer le DTO UserCollectionInput en entité UserCollection
 * Respecte la règle 185 (DTO + ObjectMapper/State Processor)
 */
final readonly class UserCollectionProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $entityManager
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof UserCollectionInput) {
            // Mapping manuel (ou via ObjectMapper si configuré, mais ici on reste explicite pour la clarté)
            $entity = new UserCollection();
            $entity->setName($data->name);

            // Résolution de l'utilisateur (on attend un IRI comme /api/users/1)
            if ($data->user) {
                // Extraction de l'ID depuis l'IRI
                $parts = explode('/', $data->user);
                $userId = (int) end($parts);
                $user = $this->entityManager->getRepository(User::class)->find($userId);
                if ($user) {
                    $entity->setUser($user);
                }
            }

            return $this->persistProcessor->process($entity, $operation, $uriVariables, $context);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
