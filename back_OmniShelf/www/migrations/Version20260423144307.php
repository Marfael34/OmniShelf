<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260423144307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // 1. Supprimer toutes les clés étrangères existantes (noms variés possibles)
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY IF EXISTS FK_556C09F0A76ED395');
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY IF EXISTS FK_556C09F0514956FD');
        $this->addSql('ALTER TABLE user_collection DROP FOREIGN KEY IF EXISTS FK_5B2AA3DEA76ED395');
        $this->addSql('ALTER TABLE user_collection DROP FOREIGN KEY IF EXISTS FK_2452B4D3A76ED395');

        // 2. Vider les tables car la conversion BINARY(16) -> INT est impossible avec des données UUID
        $this->addSql('SET FOREIGN_KEY_CHECKS = 0');
        $this->addSql('TRUNCATE TABLE collection_item');
        $this->addSql('TRUNCATE TABLE user_collection');
        $this->addSql('TRUNCATE TABLE `user`');
        $this->addSql('SET FOREIGN_KEY_CHECKS = 1');

        // 3. Changer tous les types en INT
        $this->addSql('ALTER TABLE `user` CHANGE id id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('ALTER TABLE user_collection CHANGE id id INT AUTO_INCREMENT NOT NULL, CHANGE user_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE collection_item CHANGE id id INT AUTO_INCREMENT NOT NULL, CHANGE user_id user_id INT NOT NULL, CHANGE collection_id collection_id INT DEFAULT NULL');

        // 4. Recréer les clés étrangères
        $this->addSql('ALTER TABLE user_collection ADD CONSTRAINT FK_5B2AA3DEA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE collection_item ADD CONSTRAINT FK_556C09F0514956FD FOREIGN KEY (collection_id) REFERENCES user_collection (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0A76ED395');
        $this->addSql('ALTER TABLE collection_item DROP FOREIGN KEY FK_556C09F0514956FD');
        $this->addSql('ALTER TABLE collection_item CHANGE id id BINARY(16) NOT NULL');
        $this->addSql('ALTER TABLE `user` CHANGE id id BINARY(16) NOT NULL');
        $this->addSql('ALTER TABLE user_collection DROP FOREIGN KEY FK_5B2AA3DEA76ED395');
    }
}
