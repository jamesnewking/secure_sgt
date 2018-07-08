<?php
if( empty($_POST['id'] )){
    $output['errors'][] = 'WTF? missing something in the id';
}else if((!filter_var( $_POST['id'],FILTER_VALIDATE_INT))){
    $output['errors'][] = 'id not a whole number';
} else
{
    $id = $_POST['id'];
    $result = null;
    //DELETE FROM `student_data` WHERE `id` = 30
    $query = "DELETE FROM `student_data` WHERE `id` = $id";

    if ($result = mysqli_query($conn, $query)){
        print("this was the result: $result\n");
        if($result=='1'){$output['success'] = true;}
        //did not get $result=='0' when the update was exactly the same... weird
    }else{
        $output['errors'][] = 'database error';
    }
}
//
//check if you have all the data you need from the client-side call.  
//if not, add an appropriate error to errors

//write a query that deletes the student by the given student ID  
//$result = null;
//send the query to the database, store the result of the query into $result


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1
		//if it did, change output success to true
		
	//if not, add to the errors: 'delete error'

?>