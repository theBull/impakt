<?php
	
	$id = $_POST['id'];
	
	echo file_get_contents('../data/play_' . $id . '.json');

?>