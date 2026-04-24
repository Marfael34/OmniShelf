<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CollectionItemInput
{
    #[Groups(['item:write'])]
    #[Assert\NotBlank]
    public string $externalProductId = '';

    #[Groups(['item:write'])]
    #[Assert\NotBlank]
    public string $category = '';

    #[Groups(['item:write'])]
    public bool $isWishlist = false;

    #[Groups(['item:write'])]
    public ?string $collection = null; // IRI format: /api/user_collections/1
}
