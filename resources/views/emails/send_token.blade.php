<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body>
    <h1>Thanks for Registering with us!</h1>

    <p>Good day, {{ $get_user_name }}</p>
    <p>Your OTP is: <strong>{{ $validToken }}</strong></p>
    <p>Use this OTP to verify your email.</p>
    <p>Didn't register? Ignore this email.</p>
</body>
</html>

