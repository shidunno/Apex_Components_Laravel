<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
    @routes
    @vite(['resources/js/app.jsx'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    @inertia
</body>
</html>