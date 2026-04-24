<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserCollectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserCollectionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['collection:read']],
    denormalizationContext: ['groups' => ['collection:write']],
    input: \App\Dto\UserCollectionInput::class,
    operations: [
        new GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')"),
        new Get(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new Post(
            processor: \App\State\UserCollectionProcessor::class,
            security: "is_granted('IS_AUTHENTICATED_FULLY')"
        ),
        new Put(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new Delete(security: "is_granted('ROLE_USER') and object.getUser() == user"),
    ]
)]
class UserCollection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['collection:read', 'item:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['collection:read', 'collection:write', 'item:read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['collection:read'])]
    private ?User $user = null;

    /**
     * @var Collection<int, CollectionItem>
     */
    #[ORM\OneToMany(targetEntity: CollectionItem::class, mappedBy: 'collection', cascade: ['remove'])]
    private Collection $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
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

    /**
     * @return Collection<int, CollectionItem>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(CollectionItem $item): static
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setCollection($this);
        }
        return $this;
    }

    public function removeItem(CollectionItem $item): static
    {
        if ($this->items->removeElement($item)) {
            if ($item->getCollection() === $this) {
                $item->setCollection(null);
            }
        }
        return $this;
    }
}
