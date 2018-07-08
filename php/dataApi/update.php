<?php
if(empty($_POST['name']) || empty($_POST['grade']) || empty($_POST['course'] ) || empty($_POST['id'] )){
    $output['errors'][] = 'WTF? missing something in the key words';
}else if((!filter_var( $_POST['grade'],FILTER_VALIDATE_INT)) || (!filter_var( $_POST['id'],FILTER_VALIDATE_INT))){
    $output['errors'][] = 'grade or id not a whole number';
} else if($_POST['grade']>100){
    $output['errors'][] = 'grade is out of bounds';
} else
{
    $name = stripslashes( $_POST['name']);
    $grade = $_POST['grade'];
    $course = stripslashes( $_POST['course']);
    $id = $_POST['id'];
    $result = null;
    //UPDATE `student_data` SET `name`='James',`grade`='90',`course_name`='what?' WHERE `id`=30
    $query = "UPDATE `student_data` SET `name`='$name',`grade`='$grade',`course_name`='$course' WHERE `id`='$id'";

    if ($result = mysqli_query($conn, $query)){
        print("this was the result: $result\n");
        if($result=='1'){$output['success'] = true;}
        //did not get $result=='0' when the update was exactly the same... weird
    }else{
        $output['errors'][] = 'database error';
    }
}

//**
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
//if not, add an appropriate error to errors

//write a query that updates the data at the given student ID.  
//$result = null;
//send the query to the database, store the result of the query into $result


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		//if it did, change output success to true
	//if not, add to the errors: 'update error'

?>