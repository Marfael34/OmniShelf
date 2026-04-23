<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260423142710 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Drop foreign keys
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0A76ED395');
        $this->addSql('ALTER TABLE user_collection DROP FOREIGN KEY FK_2452B4D3A76ED395');

        // Change types
        $this->addSql('ALTER TABLE collection_item CHANGE user_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_collection CHANGE user_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE id id INT AUTO_INCREMENT NOT NULL');

        // Recreate foreign keys
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_collection ADD CONSTRAINT FK_2452B4D3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE collection_item CHANGE user_id user_id BINARY(16) NOT NULL');
        $this->addSql('ALTER TABLE `user` CHANGE id id BINARY(16) NOT NULL');
        $this->addSql('ALTER TABLE user_collection CHANGE user_id user_id BINARY(16) NOT NULL');
    }
}
