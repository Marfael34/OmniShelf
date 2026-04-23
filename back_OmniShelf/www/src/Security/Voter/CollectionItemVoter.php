<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\CollectionItem;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class CollectionItemVoter extends Voter
{
    public const VIEW = 'COLLECTION_ITEM_VIEW';
    public const EDIT = 'COLLECTION_ITEM_EDIT';
    public const DELETE = 'COLLECTION_ITEM_DELETE';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE])
            && $subject instanceof \App\Entity\CollectionItem;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, \Symfony\Component\Security\Core\Authentication\Token\TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        /** @var CollectionItem $subject */
        return $subject->getUser() === $user;
    }
}
