<?php
//need to check for sql injection attack; remove ; = @ *
//[^(a-zA-Z0-9' )] remove these regex matches

//check if you have all the data you need from the client-side call.  
//if not, add an appropriate error to errors

if(empty($_POST['name']) || empty($_POST['grade']) || empty($_POST['course'])){
    $output['errors'][] = 'WTF? missing something in the key words';
} else if(!filter_var( $_POST['grade'],FILTER_VALIDATE_INT)){
    $output['errors'][] = 'grade not a whole number';
    //grade also needs to be under 255 because of tinyint(3) unsigned
} else if($_POST['grade']>100){
    $output['errors'][] = 'grade is out of bounds';
} else
    {
    $name = stripslashes( $_POST['name']);
    $grade = $_POST['grade'];
    $course = stripslashes( $_POST['course']);
//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
    $result = null;
//send the query to the database, store the result of the query into $result

    $query = "INSERT INTO student_data(name,grade,course_name) VALUES ('$name','$grade','$course')";


    if ($result = mysqli_query($conn, $query)){
        print("the result was $result\n");//the $result never changed to 0 even when the same row was deleted twice
        if($result==1){$output['success'] = true;
        $last_id = mysqli_insert_id($conn);
        $output['insertID'][] = "$last_id";}
        //SELECT LAST_INSERT_ID();

    }else{
        $output['errors'][] = 'database error';
    }
//check if $result is empty.  
    //if it is, add 'database error' to errors
//else: 
    //check if the number of affected rows is 1
    //if it did, change output success to true
    //get the insert ID of the row that was added
    //add 'insertID' to $output and set the value to the row's insert ID
    //if not, add to the errors: 'insert error'
}
?>