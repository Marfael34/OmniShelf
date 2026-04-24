<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\HttpOperation;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\CollectionItem;
use App\Service\ProxyService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Processeur pour enrichir les items de collection avec les métadonnées du proxy
 */
final readonly class CollectionItemProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private Security $security,
        private ProxyService $proxyService,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof CollectionItem && $operation instanceof HttpOperation && $operation->getMethod() === 'POST') {
            // 1. Assigner l'utilisateur connecté
            $user = $this->security->getUser();
            if ($user) {
                $data->setUser($user);
            }

            // 2. Enrichir avec les données du proxy si nécessaire
            if ($data->getExternalProductId() && $data->getCategory()) {
                $details = $this->proxyService->getDetails($data->getExternalProductId(), $data->getCategory());
                
                if (!empty($details)) {
                    // Normalisation pour les jeux (IGDB renvoie 'name' au lieu de 'title' dans certains cas)
                    $title = $details['name'] ?? $details['title'] ?? 'Inconnu';
                    $imageUrl = $details['backgroundImage'] ?? $details['imageUrl'] ?? null;
                    
                    if (!$data->getTitle()) {
                        $data->setTitle($title);
                    }
                    if (!$data->getImageUrl()) {
                        $data->setImageUrl($imageUrl);
                    }
                    // On peut aussi stocker le rating si dispo
                    if (isset($details['rating'])) {
                        $data->setRating((float)$details['rating']);
                    }
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
