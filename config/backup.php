<?php

return [
    'name' => env('APP_NAME', 'laravel-backup'),

    'source' => [
        'files' => [
            'include' => [],
            'exclude' => [],
            'follow_links' => false,
        ],

        'databases' => [
            'mysql',
        ],
    ],

    'destination' => [
        'disks' => [
            'local', // Ensure backups are saved to local storage
        ],
    ],
];
