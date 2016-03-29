<?php
	
	$json = json_encode($_POST);
	$id = intval($_POST['id']);

	$saveFile = '../data/play_' . $id . '.json';

	file_put_contents($saveFile, $json);

	echo $json;

?>