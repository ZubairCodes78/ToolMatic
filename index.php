<?php
// Permanent 301 redirect to clean homepage URL
http_response_code(301);
header("Location: https://toolmatic.site/", true, 301);
exit();
?>
