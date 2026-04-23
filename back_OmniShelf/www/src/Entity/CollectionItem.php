<?php

declare(strict_types=1);

// Entité de liaison entre la collection d'un utilisateur et une figurine
namespace App\Entity;

use App\Entity\User;
use App\Repository\CollectionItemRepository;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

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
            security: "is_granted('ROLE_USER') and userId == user.getId()"
        ),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('COLLECTION_ITEM_DELETE', object)")
    ]
)]
#[ApiFilter(BooleanFilter::class, properties: ['isWishlist'])]
#[ApiFilter(SearchFilter::class, properties: ['category' => 'exact'])]
class CollectionItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: UserCollection::class, inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: true)]
    private ?UserCollection $collection = null;

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
        $this->addedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
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

    public function getCollection(): ?UserCollection
    {
        return $this->collection;
    }

    public function setCollection(?UserCollection $collection): static
    {
        $this->collection = $collection;
        return $this;
    }
}
