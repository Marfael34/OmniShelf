<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260424125717 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE refresh_tokens (refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('DROP INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item');
        $this->addSql('ALTER TABLE collection_item ADD title VARCHAR(255) DEFAULT NULL, ADD image_url VARCHAR(255) DEFAULT NULL, ADD rating DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item (user_id, external_product_id, category, is_wishlist)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item');
        $this->addSql('ALTER TABLE collection_item DROP title, DROP image_url, DROP rating');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_COLLECTION_USER_PRODUCT ON collection_item (user_id, external_product_id, category)');
    }
}
