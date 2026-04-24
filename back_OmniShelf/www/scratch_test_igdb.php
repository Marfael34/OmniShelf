<?php
require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\HttpClient\HttpClient;
use App\Service\IgdbService;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

// Load .env
$env = parse_ini_file(__DIR__ . '/.env');
$clientId = $env['IGDB_CLIENT_ID'] ?? '';
$clientSecret = $env['IGDB_CLIENT_SECRET'] ?? '';

echo "Client ID: " . substr($clientId, 0, 5) . "...\n";

$client = HttpClient::create();
$cache = new FilesystemAdapter();

$service = new IgdbService($client, $cache, $clientId, $clientSecret);

echo "Searching for 'Fortnite'...\n";
$results = $service->search('Fortnite', 5);

echo "Results count: " . count($results) . "\n";
foreach ($results as $res) {
    echo "- " . $res->title . " (ID: " . $res->id . ")\n";
}
