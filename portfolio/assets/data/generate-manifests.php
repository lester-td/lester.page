<?php
function writeJson($path, $data) {
  $json = json_encode($data, JSON_PRETTY_PRINT);
  file_put_contents($path, $json);
}

function getWebpImagesRecursive($base, $prefix = '') {
  $images = [];

  foreach (glob("$base/*") as $entry) {
    if (is_dir($entry)) {
      $subName = $prefix . basename($entry) . '/';
      $images = array_merge($images, getWebpImagesRecursive($entry, $subName));
    } elseif (preg_match('/\.webp$/i', $entry)) {
      $images[] = $prefix . basename($entry);
    }
  }

  return $images;
}

function generateJsonManifests($rootDir, $namespace = '') {
  $dir = rtrim($rootDir, '/');
  $images = [];

  foreach (glob("$dir/*") as $entry) {
    if (is_dir($entry)) {
      $sub = basename($entry);
      $childNS = $namespace ? "$namespace-$sub" : $sub;
      generateJsonManifests($entry, $childNS);
    }
  }

  $images = getWebpImagesRecursive($dir);
  $jsonPath = 'assets/data/' . ($namespace ?: basename($dir)) . '.json';
  writeJson($jsonPath, $images);
}

// Generate gallery JSONs
foreach (glob('assets/images/*') as $galleryRoot) {
  if (is_dir($galleryRoot)) {
    generateJsonManifests($galleryRoot);
  }
}

// Blog posts
$posts = glob("assets/posts/*.md");

// Sort newest first based on filename (assumes yyyymmdd-hhmm-title.md)
usort($posts, function($a, $b) {
  return strcmp(basename($b), basename($a));
});

$postList = array_map(function($file) {
  $filename = pathinfo($file, PATHINFO_FILENAME);

  // Remove date-time prefix from filename to extract title
  $cleanTitle = preg_replace('/^\d{8}-\d{4}-/', '', $filename);
  $title = ucwords(str_replace('-', ' ', $cleanTitle));

  return [
    'title' => $title,
    'file' => basename($file)
  ];
}, $posts);

writeJson("assets/data/posts.json", $postList);
?>
