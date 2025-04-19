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

switch ($action) {
    case 'login':
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
        try {
            // Query to get password by username
            $stmt = $pdo->prepare("SELECT * FROM user_infor WHERE username = :username");
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            // Check if user exists
            if (!$user) {
                echo json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
                exit;
            }
            // Check password directly, no encoding,decoding yet
            if ($password === $user['password']) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'username' => $username,
                        'email' => $user['email'],
                        'fullname' => $user['fullname'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error adding user: ' . $e->getMessage()
            ]);
        }
        break;
    case 'add_user':
        // Xử lý thêm người dùng mới
        $username = $json_data['username'] ?? $_POST['username'] ?? '';
        $password = $json_data['password'] ?? $_POST['password'] ?? '';
        $email = $json_data['email'] ?? $_POST['email'] ?? '';
        $fullname = $json_data['fullname'] ?? $_POST['fullname'] ?? '';
        $role = $json_data['role'] ?? $_POST['role'] ?? 2; // Mặc định là user

        if (!$username || !$password || !$email || !$fullname) {
            echo json_encode([
                'success' => false,
                'message' => 'All fields are required'
            ]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO user_infor (username, password, email, fullname, role) VALUES (:username, :password, :email, :fullname, :role)");
            $stmt->execute([
                'username' => $username,
                'password' => $password, // Lưu ý: Cần mã hóa mật khẩu trước khi lưu
                'email' => $email,
                'fullname' => $fullname,
                'role' => $role
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'User added successfully'
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error adding user: ' . $e->getMessage()
            ]);
        }
        break;
    case 'list_stations':
        // Xử lý liệt kê thông tin trạm
        try {
            $stmt = $pdo->Query("select * from stations");
            $stations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'success' => true,
                'stations' => $stations
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error adding user: ' . $e->getMessage()
            ]);
        }
        break;
    case 'latest_data':
        // Lấy dữ liệu gần nhất từ 1 trạm
        $stationId = $input['station_id'] ?? 0;
        if (!$stationId) {
            echo json_encode(['success' => false, 'message' => 'Missing station_id']);
            break;
        }

        $stmt = $pdo->prepare("SELECT * FROM weather_data WHERE station_id = ? ORDER BY timestamp DESC LIMIT 1");
        $stmt->execute([$stationId]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            echo json_encode(['success' => true, 'data' => $data]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No data found']);
        }
        break;
    default:
        // Default response
        echo json_encode([
            'success' => true,
            'message' => 'API is working!',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
}
?>