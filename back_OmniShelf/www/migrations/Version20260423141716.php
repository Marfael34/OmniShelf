<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260423141716 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_collection (id BINARY(16) NOT NULL, name VARCHAR(255) NOT NULL, user_id BINARY(16) NOT NULL, INDEX IDX_5B2AA3DEA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE user_collection ADD CONSTRAINT FK_5B2AA3DEA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE collection_item ADD collection_id BINARY(16) DEFAULT NULL');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0514956FD FOREIGN KEY (collection_id) REFERENCES user_collection (id)');
        $this->addSql('CREATE INDEX IDX_556C09F0514956FD ON collection_item (collection_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_collection DROP FOREIGN KEY FK_5B2AA3DEA76ED395');
        $this->addSql('DROP TABLE user_collection');
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0514956FD');
        $this->addSql('DROP INDEX IDX_556C09F0514956FD ON collection_item');
        $this->addSql('ALTER TABLE collection_item DROP collection_id');
    }
}
