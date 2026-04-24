<?php

require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpClient\HttpClient;
use App\Service\ProxyService;

$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

$httpClient = HttpClient::create();
$proxyService = new ProxyService($httpClient);

echo "--- Testing IGDB Search (Minecraft) ---\n";
$results = $proxyService->search('Minecraft', 'game');

if (empty($results)) {
    echo "❌ No results found. Check your API keys and ProxyService logic.\n";
} else {
    echo "✅ Found " . count($results) . " results.\n";
    foreach ($results as $game) {
        echo "- {$game->title} (ID: {$game->id})\n";
        echo "  Category: {$game->category}\n";
        echo "  Publisher: {$game->metadata['publisher']}\n";
        echo "  Platform: {$game->metadata['platform']}\n";
        echo "  Release Year: {$game->metadata['releaseYear']}\n";
        echo "  Image: {$game->imageUrl}\n\n";
    }
}

echo "--- Testing IGDB Details (First result) ---\n";
if (!empty($results)) {
    $firstId = $results[0]->id;
    $details = $proxyService->getDetails($firstId, 'game');
    echo "✅ Details for {$firstId}:\n";
    print_r($details);
}
