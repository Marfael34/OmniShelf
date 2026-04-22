<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260421132527 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE collection_item (id BINARY(16) NOT NULL, added_at DATETIME NOT NULL, user_id BINARY(16) NOT NULL, figurine_id BINARY(16) NOT NULL, INDEX IDX_556C09F0A76ED395 (user_id), INDEX IDX_556C09F0C550FC1B (figurine_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE figurine (id BINARY(16) NOT NULL, barcode VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, brand VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, image_url VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_FIGURINE_BARCODE (barcode), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id BINARY(16) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0C550FC1B FOREIGN KEY (figurine_id) REFERENCES figurine (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0A76ED395');
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0C550FC1B');
        $this->addSql('DROP TABLE collection_item');
        $this->addSql('DROP TABLE figurine');
        $this->addSql('DROP TABLE `user`');
    }
}
