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
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CollectionItemRepository::class)]
#[ORM\Table(name: 'collection_item')]
#[ORM\UniqueConstraint(name: 'UNIQ_COLLECTION_USER_PRODUCT', columns: ['user_id', 'external_product_id', 'category', 'is_wishlist'])]
#[ApiResource(
    normalizationContext: ['groups' => ['item:read']],
    denormalizationContext: ['groups' => ['item:write']],
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(
            uriTemplate: '/users/{userId}/collection_items',
            uriVariables: [
                'userId' => new Link(toProperty: 'user', fromClass: User::class)
            ],
            security: "is_granted('ROLE_USER') and (userId == user.getId() or is_granted('ROLE_ADMIN'))"
        ),
        new Post(
            security: "is_granted('ROLE_USER')",
            denormalizationContext: ['groups' => ['item:write']],
            processor: \App\State\CollectionItemProcessor::class
        ),
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
    #[Groups(['item:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: UserCollection::class, inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['item:read', 'item:write'])]
    private ?UserCollection $collection = null;

    #[ORM\Column(length: 255)]
    #[Groups(['item:read', 'item:write'])]
    private ?string $externalProductId = null;

    #[ORM\Column(length: 50)]
    #[Groups(['item:read', 'item:write'])]
    private ?string $category = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups(['item:read', 'item:write'])]
    private bool $isWishlist = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['item:read', 'item:write'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['item:read', 'item:write'])]
    private ?string $imageUrl = null;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Groups(['item:read'])]
    private ?float $rating = null;

    #[ORM\Column]
    #[Groups(['item:read'])]
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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;
        return $this;
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(?float $rating): static
    {
        $this->rating = $rating;
        return $this;
    }

    public function setCollection(?UserCollection $collection): static
    {
        $this->collection = $collection;
        return $this;
    }
}
