<?php

declare(strict_types=1);

// Entité de liaison entre la collection d'un utilisateur et une figurine
namespace App\Entity;

use App\Entity\Figurine;
use App\Entity\User;
use App\Repository\CollectionItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: CollectionItemRepository::class)]
#[ORM\Table(name: 'collection_item')]
#[ORM\UniqueConstraint(name: 'UNIQ_COLLECTION_USER_PRODUCT', columns: ['user_id', 'external_product_id', 'category'])]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            uriTemplate: '/users/{userId}/collection_items',
            uriVariables: [
                'userId' => new Link(toProperty: 'user', fromClass: User::class)
            ],
            security: "is_granted('ROLE_USER') and userId == user.getId().toRfc4122()"
        ),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('COLLECTION_ITEM_DELETE', object)")
    ]
)]
class CollectionItem
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    private ?string $externalProductId = null;

    #[ORM\Column(length: 50)]
    private ?string $category = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isWishlist = false;

    #[ORM\Column]
    private ?\DateTimeImmutable $addedAt = null;

    public function __construct()
    {
        $this->id = Uuid::v7();
        $this->addedAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getExternalProductId(): ?string
    {
        return $this->externalProductId;
    }

    public function setExternalProductId(string $externalProductId): static
    {
        $this->externalProductId = $externalProductId;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function isWishlist(): bool
    {
        return $this->isWishlist;
    }

    public function setIsWishlist(bool $isWishlist): static
    {
        $this->isWishlist = $isWishlist;

        return $this;
    }

    public function getAddedAt(): ?\DateTimeImmutable
    {
        return $this->addedAt;
    }
}

