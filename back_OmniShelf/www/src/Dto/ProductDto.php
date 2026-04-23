<?php

declare(strict_types=1);

namespace App\Dto;

final class ProductDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $externalProductId,
        public readonly string $title,
        public readonly string $category,
        public readonly ?string $imageUrl = null,
        public readonly ?string $author = null,
        public readonly ?float $rating = null,
        public readonly ?string $year = null,
        public readonly array $metadata = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? '',
            externalProductId: $data['externalProductId'] ?? ($data['id'] ?? ''),
            title: $data['title'] ?? 'Sans titre',
            category: $data['category'] ?? 'unknown',
            imageUrl: $data['imageUrl'] ?? null,
            author: $data['author'] ?? null,
            rating: isset($data['rating']) ? (float)$data['rating'] : null,
            year: isset($data['year']) ? (string)$data['year'] : null,
            metadata: $data['metadata'] ?? [],
        );
    }
}
