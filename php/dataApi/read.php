<?php
$query = "SELECT * FROM `student_data`";
//write a query that selects all the students from the database, all the data from each row
$result = null;
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn,$query);

if (!$result){
    $errors = "database error";
} else {
    if(mysqli_num_rows($result)>0){
        $output["success"] = true;
        $output['data']=[];
        while ( $row = mysqli_fetch_assoc($result) ){
            $output['data'][] = $row;
        }
    }else{
        $output["errors"][] = "no data";
    }
}

//print_r($_GET);
//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if any data came back

		//if it did, change output success to true
		//do a while loop to collect all the data 
			//add each row of data to the $output['data'] array
	//if not, add to the errors: 'no data'

?>