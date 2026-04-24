<?php
echo "IGDB_CLIENT_ID: " . ($_ENV['IGDB_CLIENT_ID'] ?? 'NOT SET') . "\n";
echo "IGDB_CLIENT_SECRET: " . (isset($_ENV['IGDB_CLIENT_SECRET']) ? 'SET (length: ' . strlen($_ENV['IGDB_CLIENT_SECRET']) . ')' : 'NOT SET') . "\n";
echo "APP_ENV: " . ($_ENV['APP_ENV'] ?? 'NOT SET') . "\n";
?>
