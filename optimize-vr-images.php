<?php

/**
 * VR Image Optimization Script
 *
 * This script optimizes large VR tour images to reduce file size
 * while maintaining acceptable quality for 360° viewing.
 */

// Increase memory limit for large images
ini_set('memory_limit', '512M');

$sourceDir = __DIR__ . '/storage/app/public/activities/vr';
$outputDir = __DIR__ . '/storage/app/public/activities/vr_optimized';

// Create output directory if it doesn't exist
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

// Get all images in the VR directory
$images = glob($sourceDir . '/*.{jpg,jpeg,png,JPG,JPEG,PNG}', GLOB_BRACE);

if (empty($images)) {
    echo "No images found in {$sourceDir}\n";
    exit(1);
}

echo "Found " . count($images) . " images to optimize\n\n";

foreach ($images as $imagePath) {
    $filename = basename($imagePath);
    $outputPath = $outputDir . '/' . $filename;

    echo "Processing: {$filename}\n";

    // Get original file size
    $originalSize = filesize($imagePath);
    echo "  Original size: " . formatBytes($originalSize) . "\n";

    // Load image
    $imageType = exif_imagetype($imagePath);

    switch ($imageType) {
        case IMAGETYPE_JPEG:
            $image = imagecreatefromjpeg($imagePath);
            break;
        case IMAGETYPE_PNG:
            $image = imagecreatefrompng($imagePath);
            break;
        default:
            echo "  Skipping unsupported image type\n\n";
            continue 2;
    }

    if (!$image) {
        echo "  Failed to load image\n\n";
        continue;
    }

    // Get original dimensions
    $width = imagesx($image);
    $height = imagesy($image);
    echo "  Original dimensions: {$width}x{$height}\n";

    // Calculate new dimensions (max 2048px width for VR images)
    $maxWidth = 2048;
    $maxHeight = 1024;

    if ($width > $maxWidth || $height > $maxHeight) {
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = round($width * $ratio);
        $newHeight = round($height * $ratio);

        echo "  Resizing to: {$newWidth}x{$newHeight}\n";

        // Create resized image
        $resized = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($image);
        $image = $resized;
    }

    // Save optimized image with 80% quality (good balance for VR)
    imagejpeg($image, $outputPath, 80);
    imagedestroy($image);

    // Get new file size
    $newSize = filesize($outputPath);
    $reduction = (1 - ($newSize / $originalSize)) * 100;

    echo "  Optimized size: " . formatBytes($newSize) . "\n";
    echo "  Reduction: " . number_format($reduction, 1) . "%\n";
    echo "  Saved to: {$outputPath}\n\n";
}

echo "Optimization complete!\n";
echo "\nNext steps:\n";
echo "1. Review the optimized images in: {$outputDir}\n";
echo "2. If satisfied, replace the original files:\n";
echo "   - Delete files in: {$sourceDir}\n";
echo "   - Move files from: {$outputDir} to {$sourceDir}\n";

function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}
