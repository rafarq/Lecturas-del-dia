<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuration
$apiKey = 'sk-f0e8c4dc3c1a44d3ac36f3a38f7f85a7'; // DeepSeek API Key
$apiUrl = 'https://api.deepseek.com/v1/chat/completions';
$model = 'deepseek-chat';
$cacheFile = __DIR__ . '/reflection.json';

// 1. Check for cached reflection
$today = date('Y-m-d');
if (file_exists($cacheFile)) {
    $cached = json_decode(file_get_contents($cacheFile), true);
    if ($cached && isset($cached['date']) && $cached['date'] === $today) {
        echo json_encode(['reflection' => $cached['reflection'], 'date' => $today, 'source' => 'cache']);
        exit;
    }
}

// 2. Fetch RSS Feed to get readings
$rssUrl = 'https://rss.evangelizo.org/rss/v2/evangelizo_rss-sp.xml';
$rssContent = @file_get_contents($rssUrl);

if (!$rssContent) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch RSS feed']);
    exit;
}

// 3. Parse RSS
try {
    $xml = new SimpleXMLElement($rssContent);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse RSS feed']);
    exit;
}

$readingsText = "";
$todayDay = date('d');
$todayMonth = date('m'); // 01-12

// Helper to map month names to numbers if needed, but we can try to match date logic
// The RSS format is tricky, let's try to filter by today's date if possible, 
// or just take the first items if they are for today. 
// Evangelizo RSS usually returns a list. We need to filter for today.

$items = [];
foreach ($xml->channel->item as $item) {
    // Title format example: "22 De Noviembre : Viernes de la 33ª semana del Tiempo Ordinario"
    // We can check if the title contains today's day and month name, or just trust the feed order?
    // Better to be safe.
    
    // Spanish month names
    $months = [
        '01' => 'Enero', '02' => 'Febrero', '03' => 'Marzo', '04' => 'Abril',
        '05' => 'Mayo', '06' => 'Junio', '07' => 'Julio', '08' => 'Agosto',
        '09' => 'Septiembre', '10' => 'Octubre', '11' => 'Noviembre', '12' => 'Diciembre'
    ];
    
    $currentMonthName = $months[$todayMonth];
    // Simple check: does title contain "22" and "Noviembre"?
    // Note: $todayDay might have leading zero, title might not.
    $dayInt = (int)$todayDay;
    
    if (stripos($item->title, "$dayInt De $currentMonthName") !== false) {
        $items[] = $item;
    }
}

if (empty($items)) {
    // Fallback: if no match found (maybe date format changed), just take the first few items?
    // Or return error. Let's return error to be safe, or mock.
    // Actually, let's try to just grab the first item's date and see if it matches?
    // For now, let's assume the filter works. If not, we might fail to generate.
    // Let's try to be robust: if empty, maybe the feed is just for today?
    // Let's just use all items if filter fails, assuming the feed is daily.
    // But Evangelizo feed has multiple days usually? No, usually just today or a few.
    // Let's stick to the filter.
}

// Build readings text
$readingsContent = [];
foreach ($items as $item) {
    $category = (string)$item->category;
    $title = (string)$item->title;
    // Extract reference from title (after :)
    $parts = explode(':', $title);
    $reference = count($parts) > 1 ? trim($parts[1]) : '';
    
    $description = (string)$item->description;
    // Clean HTML
    $cleanText = strip_tags(str_replace(['<![CDATA[', ']]>'], '', $description));
    
    $readingsContent[] = "$category ($reference):\n$cleanText";
}

$fullText = implode("\n\n", $readingsContent);

if (empty($fullText)) {
     http_response_code(500);
     echo json_encode(['error' => 'No readings found for today']);
     exit;
}

// 4. Call DeepSeek API
$prompt = "Basándote en las siguientes lecturas católicas del día, escribe una reflexión BREVE y profunda en SEGUNDA PERSONA, como si Jesús estuviera hablando directamente al lector. Usa \"tú\", \"te\", \"tu\" y habla en primera persona como Jesús (\"Yo quiero...\", \"Te pido...\", \"Deseo que...\"). La reflexión debe ser personal, íntima, amorosa y práctica. IMPORTANTE: La reflexión debe tener MÁXIMO 200 palabras.\n\nEjemplo de tono: \"Quiero que no busques tu gloria personal porque quiero conducirte por la gloria eterna. Te pido que confíes en mí...\"\n\nLecturas del día:\n\n$fullText";

$data = [
    'model' => $model,
    'messages' => [
        [
            'role' => 'system',
            'content' => 'Eres Jesús hablando directamente a una persona que lee las lecturas del día. Hablas en primera persona como Jesús ("Yo quiero", "Te pido", "Deseo que") y te diriges al lector en segunda persona ("tú", "te", "tu"). Tu tono es amoroso, cercano, compasivo y personal. IMPORTANTE: Sé BREVE y CONCISO, máximo 100-150 palabras.'
        ],
        [
            'role' => 'user',
            'content' => $prompt
        ]
    ],
    'temperature' => 0.7,
    'max_tokens' => 250
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(500);
    echo json_encode(['error' => 'DeepSeek API error', 'details' => $response]);
    exit;
}

$responseData = json_decode($response, true);
$reflection = $responseData['choices'][0]['message']['content'] ?? '';

if (!$reflection) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate reflection content']);
    exit;
}

// 5. Save to cache
$cacheData = [
    'date' => $today,
    'reflection' => $reflection
];
file_put_contents($cacheFile, json_encode($cacheData));

// 6. Return result
echo json_encode(['reflection' => $reflection, 'date' => $today, 'source' => 'api']);
