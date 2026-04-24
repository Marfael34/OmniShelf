<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class UserCollectionInput
{
    #[Groups(['collection:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    public string $name = '';

    #[Groups(['collection:write'])]
    #[Assert\NotBlank]
    public string $user = '';
}
