/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
//var student_array=[];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    handleDataServerClick();
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $('button.btn-success').on('click',handleAddClicked);
    $('button.btn-default').on('click',handleCancelClick);
    $('button.btn-primary').on('click',handleDataServerClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
    addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}

function handleDataServerClick(){
    console.log('Get data clicked!');
    $.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'http://localhost:8000/php/data.php',
        data: {action: 'readAll'},
        //data: {api_key: '949v6hSK4M'},
        success: function(response){
            console.log('ajax says:', response);
            var serverGT = response;
            var studentLocalArray = [];
            var studentsTotalGPA = 0;
            for (let index in serverGT.data){
            // either way will work
            //for (var index = 0; index < serverGT.data.length; index++){
                var serverStudent = {
                    name : serverGT.data[index].name,
                    course: serverGT.data[index].course_name,
                    grade: parseInt( serverGT.data[index].grade),
                    id: serverGT.data[index].id
                };
                var tableRow = $('<tr>');
                var tempName = $('<td>').text( serverStudent.name );
                var tempCourse = $('<td>').text( serverStudent.course );
                var tempGrade = $('<td>').text( serverStudent.grade );
                studentsTotalGPA += serverStudent.grade;
                function removeItLater(){
                    removeFromServer( $(this).parent()[0].studentId );
                    handleDataServerClick();
                };
                var tempButton = $('<button>').addClass('btn').addClass('btn-danger').text('Delete').on('click',removeItLater);
                $(tableRow).append(tempName).append(tempCourse).append(tempGrade).append(tempButton);
                $(tableRow)[0].studentId = serverStudent.id; //embedded .id into the element at studentID
                studentLocalArray.unshift( $(tableRow) );
        }
        renderEntireServerOnDOM(studentLocalArray);
        var tempGrades = calculateGradeAverage(studentsTotalGPA,studentLocalArray.length);
        renderGradeAverage( tempGrades );
        }
    })
}

function addToServer(studentObj){
//input studentObj and returns the studentObj from server with id
    $.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'http://localhost:8000/php/data.php',
        data: {
                action: 'insert',
                name: studentObj.name,
                course: studentObj.course,
                grade: studentObj.grade
        },
        success: function(response){
            //console.log('ajax says:', response);

            var studentFromServer = studentObj;
            studentFromServer.id = response.new_id;
            console.log('newID '+ studentFromServer.id);
            console.dir( response);
            return studentFromServer;
        }
    })
}

function removeFromServer(studentIDonServer){
//input studentID and returns true when success
    $.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'http://localhost:8000/php/data.php',
        data: {
            action: "delete",
            id: studentIDonServer
        },
        success: function(response){
            if(!response.success){
                alert(response.errors + ' because you did not add this student into the server');
                console.dir(response);
            }
            handleDataServerClick();//refresh the screen
            return response;
        }
    })
}

/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    var tempName = $('input[name="studentName"]').val();
    var tempCourse = $('input[name="course"]').val();
    var tempGrade = $('input[name="studentGrade"]').val();
    tempGrade = parseInt(tempGrade);
    //debugger;
    var tempStudent = {
        name :  tempName,
        course: tempCourse,
        grade:  tempGrade
    };
    var errorsOnInput = false;
    var outputFailMessage = '';
    if (tempName.length < 2){
        errorsOnInput = true;
        //$('input[name="studentName"]').attr('placeholder','missing Student Name');
        //couldn't figure out a way to change the input placeholder's color without adding a new class
        outputFailMessage += 'Name needs to be at least 2 characters. ';
    }
    if (tempName.length < 2){
        errorsOnInput = true;
        outputFailMessage += 'Course needs to be at least 2 characters. ';
    }
    if (isNaN(tempGrade) || tempGrade>100){
        errorsOnInput = true;
        outputFailMessage += 'Student grade is not a valid number.';
    }
    if (errorsOnInput){alert('Error: ' + outputFailMessage)};
    if (!errorsOnInput){ addToServer(tempStudent);}
    //student_array.push(tempStudent);

clearAddStudentFormInputs();
handleDataServerClick();
//updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    //$('#studentName')[0].reset(); didn't work?
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}

function renderEntireServerOnDOM(studentArr){
    $('tbody').children().remove();
    $('tbody').append(studentArr);

};

function calculateGradeAverage(sumGrades,totalPupils){
    outputAverage = sumGrades / totalPupils;
    outputAverage = outputAverage.toFixed(2);
    if ( outputAverage === 'NaN' ){outputAverage = 0}
    return outputAverage;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(inAverage){
    //var outputAvg = calculateGradeAverage();
    $('.avgGrade.label.label-default').text(inAverage);
}





//did not use code below when I removed the global array
//
//
//
// /***************************************************************************************************
//  * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
//  * into the .student_list tbody
//  * @param {object} studentObj a single student object with course, name, and grade inside
//  */
// function renderStudentOnDom(studentObj){
//     //$('tbody > tr').remove(); //to clean the previously displayed items
//     // for (var index in s_array){
//     //     var tableRow = $('<tr>');
//     //     var tempName = $('<td>').text( s_array[index].name );
//     //     var tempCourse = $('<td>').text( s_array[index].course );
//     //     var tempGrade = $('<td>').text( s_array[index].grade );
//     //     var tempButton = $('<button>').addClass('btn').addClass('btn-danger').text('Delete');
//     //     removeStudent(index);//need a separate function to call on.click to pass in index
//     //     function removeStudent(index){
//     //         $(tempButton).on('click', function(){
//     //             s_array.splice(index,1);
//     //             updateStudentList(s_array);
//     //         });
//     //     }
//     //     $(tableRow).append(tempName).append(tempCourse).append(tempGrade).append(tempButton);
//     //     $('tbody').append(tableRow);
//     //
//     // }
//     var tableRow = $('<tr>');
//     var tempName = $('<td>').text( studentObj.name );
//     var tempCourse = $('<td>').text( studentObj.course );
//     var tempGrade = $('<td>').text( studentObj.grade );
//     var tempButton = $('<button>').addClass('btn').addClass('btn-danger').text('Delete');
//     $(tempButton).on('click',function(){
//         //removeStudent(student_array);
//         var previousStudents = $(this).parent().prevUntil('tbody');
//         var deleteIndex = student_array.length - previousStudents.length -1;
//         //var whereInArray = student_array.indexOf(studentObj);
//         //student_array.splice(whereInArray,1);
//         student_array.splice(deleteIndex,1);
//         $(this).parent().remove();
//         console.log(previousStudents.length);
//         var tempAverage = calculateGradeAverage(student_array);
//         renderGradeAverage( tempAverage );
//
//     });
//     $(tableRow).append(tempName).append(tempCourse).append(tempGrade).append(tempButton);
//     $('tbody').prepend(tableRow); //this will make it very hard to determin the location on the array
//     //$('tbody').append(tableRow);
// }
//
// //added this function
// // /***************************************************************************************************
// //  * removeStudent - remove the student from DOM and array
// //  * @param students {array} the array of student objects
// //  * @returns {undefined} none
// //  * @calls calculateGradeAverage, renderGradeAverage
// //  */
// // function removeStudent(s_array){
// //     //should be able to use this as the trigger element
// //     var previousStudents = $(this).parent().prevUntil('tbody');
// //     var deleteIndex = s_array.length - previousStudents.length -1;
// //     s_array.splice(deleteIndex,1);
// //     $(this).parent().remove();
// //     console.log(previousStudents.length);
// //     var tempAverage = calculateGradeAverage(s_array);
// //     renderGradeAverage( tempAverage );
// // }
//
//
// /***************************************************************************************************
//  * updateStudentList - centralized function to update the average and call student list update
//  * @param students {array} the array of student objects
//  * @returns {undefined} none
//  * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
//  */
// function updateStudentList(s_array){
//   var  studentObject = s_array[s_array.length-1];
//   renderStudentOnDom(studentObject);
//   var tempAverage = calculateGradeAverage(s_array);
//   renderGradeAverage( tempAverage );
// }
// /***************************************************************************************************
//  * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
//  * @param: {array} students  the array of student objects
//  * @returns {number}
//  */






