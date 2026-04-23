<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260423141415 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY `FK_556C09F0C550FC1B`');
        $this->addSql('DROP INDEX IDX_556C09F0C550FC1B ON collection_item');
        $this->addSql('ALTER TABLE collection_item ADD external_product_id VARCHAR(255) NOT NULL, ADD category VARCHAR(50) NOT NULL, ADD is_wishlist TINYINT DEFAULT 0 NOT NULL, DROP figurine_id');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item (user_id, external_product_id, category)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item');
        $this->addSql('ALTER TABLE collection_item ADD figurine_id BINARY(16) NOT NULL, DROP external_product_id, DROP category, DROP is_wishlist');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT `FK_556C09F0C550FC1B` FOREIGN KEY (figurine_id) REFERENCES figurine (id)');
        $this->addSql('CREATE INDEX IDX_556C09F0C550FC1B ON collection_item (figurine_id)');
    }
}
