<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log all input for debugging
$request_log = "Request method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$request_log .= "POST data: " . print_r($_POST, true) . "\n";
$request_log .= "GET data: " . print_r($_GET, true) . "\n";

// Get raw input for JSON data
$input = file_get_contents('php://input');
$request_log .= "Raw input: " . $input . "\n";

// Try to decode JSON
$json_data = json_decode($input, true);
$request_log .= "JSON decoded: " . print_r($json_data, true) . "\n";

// Write to debug log file
file_put_contents('api_debug.log', date('Y-m-d H:i:s') . "\n" . $request_log . "\n\n", FILE_APPEND);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Test response to show the API is working
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'login') {
    // Attempt to get username and password from various sources including GET
    $username = $_GET['username'] ?? $_POST['username'] ?? $json_data['username'] ?? '';
    $password = $_GET['password'] ?? $_POST['password'] ?? $json_data['password'] ?? '';
    
    file_put_contents('api_debug.log', date('Y-m-d H:i:s') . " - Login attempt with: $username\n", FILE_APPEND);
    
    if (!$username || !$password) {
        echo json_encode([
            'success' => false,
            'message' => 'Username and password are required',
            'received' => [
                'username' => $username ? 'yes' : 'no',
                'password' => $password ? 'yes' : 'no'
            ]
        ]);
        exit;
    }
    
    // For testing, just return success if username is admin
    if ($username === 'admin' && $password === 'admin') {
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'username' => $username,
                'email' => 'admin@gmail.com',
                'fullname' => 'Administrator',
                'role' => 1
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
    }
} else {
    // Default response
    echo json_encode([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?> 