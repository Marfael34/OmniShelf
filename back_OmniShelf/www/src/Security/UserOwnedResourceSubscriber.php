<?php

declare(strict_types=1);

namespace App\Security;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\CollectionItem;
use App\Entity\UserCollection;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class UserOwnedResourceSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly Security $security
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['setUserOnResource', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function setUserOnResource(ViewEvent $event): void
    {
        $resource = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!in_array($method, ['POST', 'PUT', 'PATCH'])) {
            return;
        }

        if ($resource instanceof CollectionItem || $resource instanceof UserCollection) {
            $user = $this->security->getUser();
            if ($user && method_exists($resource, 'setUser')) {
                $resource->setUser($user);
            }
        }
    }
}
