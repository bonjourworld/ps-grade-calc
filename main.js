/**
 * When the document is ready, set up all the things
 * - event binding
 * - refreshing display of courses
 */
window.onload = function() {
	// add course button
	document.querySelector('#add-course').addEventListener( 'click', showCourseForm );
	// add course cancel button
	document.querySelector('#add-course-form input[role=cancel]').addEventListener( 'click', hideCourseForm );
	// add course submit button
	document.querySelector('#add-course-form input[role=submit]').addEventListener( 'click', saveCourse );

	// add grade item button
	document.querySelector('#course-details #add-grade-item').addEventListener( 'click', showGradeItemForm );
	// add grade item cancel button
	document.querySelector('#add-grade-item-form input[role=cancel]').addEventListener( 'click', hideGradeItemForm );
	// add grade item submit button
	document.querySelector('#add-grade-item-form input[role=submit]').addEventListener( 'click', saveGradeItem );

	// refresh details display
	refreshCourseList();

}

/**
 * Reads from local storage and draws the courses in the master panel
 */
function refreshCourseList() {
	// get list
	var ul = document.getElementById( 'course-list' );
	// reset list
	ul.innerHTML = '';	
	// get courses
	var courseAry = JSON.parse( localStorage.getItem( 'courses' ) ) || [];
	// sort
	// courseAry.sort( sortCourses );
	// display courses
	for( var i in courseAry ) {
		if( courseAry.hasOwnProperty(i) ) {
			// build text
			var copy = "";
			copy += "<div class='wrapper'>";
			copy += "<span class='name'>" + courseAry[i].courseName + "</span>";
			copy += "<span class='code'>[" + courseAry[i].courseCode + "]</span>";
			copy += "</div>";
			copy += "<span class='chevron'>&gt;</span>";
			// create link components
			var link = document.createElement( 'li' );
			link.setAttribute( 'courseID', courseAry[i].courseID );
			link.innerHTML = copy;
			// add event listener
			link.addEventListener( 'click', selectCourse );
			// add link
			ul.appendChild( link );
		}
	};
}

/**
 * Selects the course from the master view into the detail
 */
function selectCourse( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// find the Course Object
	var courseID = ev.target.closest('li').getAttribute('courseID');
	var courseAry = JSON.parse( localStorage.getItem( 'courses' ) ) || [];
	var courseObj = courseAry[ 'c'+courseID ];
	// show panel
	var panel = document.querySelector('#course-details');
	panel.setAttribute( 'courseID', courseObj.courseID );
	panel.style.display = 'block';
	// populate panel with course info
	panel.querySelector('h1').textContent = courseObj.courseName;
	panel.querySelector('h3').textContent = courseObj.courseCode;
	// show grade items
	refreshGradeItems();
}

function selectGradeItem( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// find the Course Object
	var row = ev.target.closest('tr');
	var gradeItemID = row.getAttribute('gradeItemID');
	var gradeItemAry = JSON.parse( localStorage.getItem('gradeItems') ) || [];
	// select grades for the course
	var courseID = document.querySelector('#course-details').getAttribute('courseID');
	// stop if no record
	if( !gradeItemAry[ 'c'+courseID ][ 'g'+gradeItemID ] ) return;
	var gradeItemObj = gradeItemAry[ 'c'+courseID ][ 'g'+gradeItemID ];
	// show panel
	var panel = document.querySelector('#add-grade-item-form');
	panel.setAttribute( 'gradeItemID', gradeItemObj.gradeItemID );
	panel.style.display = 'block';
	// populate panel with course info
	panel.querySelector('#grade-item-name').value = gradeItemObj.name;
	panel.querySelector('#grade-item-weight').value = gradeItemObj.weight;
	panel.querySelector('#grade-item-con-grade').value = gradeItemObj.conGrade;
	panel.querySelector('#grade-item-opt-grade').value = gradeItemObj.optGrade;
	panel.querySelector('#grade-item-act-grade').value = gradeItemObj.actGrade;
}

/**
 * Displays the grade items for the course
 */
function refreshGradeItems() {
	// get list
	var list = document.querySelector( '#course-details #grade-item-list tbody' );
	// reset list
	list.innerHTML = '';	
	// get courses
	var gradeItemAry = JSON.parse( localStorage.getItem( 'gradeItems' ) ) || [];
	// if( gradeItemAry.length <= 0 ) return;
	// only grades for this course
	var courseID = document.querySelector('#course-details').getAttribute('courseID');
	gradeItemAry = gradeItemAry[ 'c'+courseID ];
	// if none
	if( !gradeItemAry || gradeItemAry.length == 0 ) {
		list.innerHTML = "<tr><td>Please add a Grade Item.</td><td></td><td></td><td></td><td></td></tr>";
		// clear footer
		document.querySelector( '#course-details #grade-item-list tfoot' ).innerHTML = '';
		return;
	}
	// sort
	// gradeItemAry.sort( sortGradeItems );
	// average counter variables
	var sumWeights = sumConGrades = sumOptGrades = sumActGrades = sumEarned = sumLost = 0;
	// display courses

	for( var i in gradeItemAry ) {
		if( gradeItemAry.hasOwnProperty(i) ) {
			var aryItem = gradeItemAry[i];
			// build text
			var xtra = "";
			var cols = "";
			cols += "<td class='name'>" + aryItem.name + "</td>";
			cols += "<td class='weight'>" + aryItem.weight + "</td>";
			cols += "<td class='con'>" + aryItem.conGrade + "</td>";
			cols += "<td class='opt'>" + aryItem.optGrade + "</td>";
			if( aryItem.actGrade == '' ) xtra = " na";
			cols += "<td class='act"+xtra+"'>" + aryItem.actGrade + "</td>";
			cols += "<td class='graph'>";
				// show graph
				//// has these parameters:
				//// - container div
				//// -- data-offset : from the left based on previous weights
				//// -- data-size : width based on weight
				//// - center target
				//// -- min and max
				//// - actual earned
				//// -- from zero to end
				//// - actual lost
				//// -- from 100 to start
				cols += "<div class='container' data-offset='"+sumWeights+"' data-width='"+aryItem.weight+"'>";
				cols += "<div class='target' data-offset='"+aryItem.conGrade+"' data-width='"+(aryItem.optGrade-aryItem.conGrade)+"'></div>";
				cols += "<div class='earned' data-width='"+aryItem.actGrade+"'></div>";
				cols += "<div class='lost' data-width='"+(100-aryItem.actGrade)+"'></div>";
				cols += "</div>"
			cols += "</td>";
			// create link components
			var item = document.createElement( 'tr' );
			item.setAttribute( 'gradeItemID', aryItem.gradeItemID );
			item.innerHTML = cols;
			// add event listener
			item.addEventListener( 'click', selectGradeItem );
			// add item
			list.appendChild( item );
			// count averages
			sumWeights += parseFloat( aryItem.weight );
			sumConGrades += parseFloat( aryItem.conGrade ) * ( parseFloat( aryItem.weight ) / 100 );
			sumOptGrades += parseFloat( aryItem.optGrade ) * ( parseFloat( aryItem.weight ) / 100 );
			sumActGrades += parseFloat( aryItem.actGrade ) * ( parseFloat( aryItem.weight ) / 100 );
			if( aryItem.actGrade != '' ) {
				sumEarned += parseFloat( aryItem.actGrade ) * ( parseFloat( aryItem.weight ) / 100 );
				sumLost += ( 100 - parseFloat( aryItem.actGrade ) ) * ( parseFloat( aryItem.weight ) / 100 );
			}
			// update graph
			var c = item.querySelector('.container');
			var t = item.querySelector('.target');
			var e = item.querySelector('.earned');
			var l = item.querySelector('.lost');
			c.style.width = c.dataset.width+'%';
			c.style.left = c.dataset.offset+'%';
			t.style.width = t.dataset.width+'%';
			t.style.left = t.dataset.offset+'%';
			if( aryItem.actGrade != '' ) {
				e.style.width = e.dataset.width+'%';
				l.style.width = l.dataset.width+'%';
			} else {
				e.style.width = '0%';
				l.style.width = '0%';
			}
		}
	}
	// update footer
	var foot = document.querySelector( '#course-details #grade-item-list tfoot' );
	foot.innerHTML = '';
	var copy = "<tr><th></th>";
	// sum of weights
	copy += "<th>"+sumWeights+"</th>";
	// conservative grade
	copy += "<th>"+sumConGrades+"</th>";
	// optimistic grade
	copy += "<th>"+sumOptGrades+"</th>";
	// actual grade
	copy += "<th>"+sumActGrades+"</th>";
	copy += "<th class='graph'>";
		// show graph
		copy += "<div class='container' data-offset='0' data-width='"+sumWeights+"'>";
		copy += "<div class='earned' data-width='"+sumEarned+"'></div>";
		copy += "<div class='lost' data-width='"+sumLost+"'></div>";
		copy += "</div>"
	copy += "</th>";
	copy += "</tr>";
	foot.innerHTML = copy;
	// update graph
	var c = foot.querySelector('.container');
	var e = foot.querySelector('.earned');
	var l = foot.querySelector('.lost');
	c.style.width = c.dataset.width+'%';
	if( sumEarned > 0 ) {
		e.style.width = e.dataset.width+'%';
	}
	if( sumLost > 0 ) {
		l.style.width = l.dataset.width+'%';
	}
}


/**
 * Displays the form for creating a new course
 */
function showCourseForm( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// hide others
	var all = document.querySelectorAll('.detail > *');
	for( var i = 0; i < all.length; i++ ) {
		all[i].style.display = 'none';
	}
	// show course form
	document.getElementById('add-course-form').style.display = 'block';
}
function hideCourseForm( ev ) {
	// get form inputs
	var formCourseCode = document.querySelector('#add-course-form #course-code');
	var formCourseName = document.querySelector('#add-course-form #course-name');
	// clear form
	formCourseCode.value = '';
	formCourseName.value = '';
	// hide course form
	document.getElementById('add-course-form').style.display = 'none';
}
/**
 * Saves the course information
 */
function saveCourse( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// get form inputs
	var formCourseCode = document.querySelector('#add-course-form #course-code');
	var formCourseName = document.querySelector('#add-course-form #course-name');
	// get form value
	var courseCode = formCourseCode.value;
	var courseName = formCourseName.value;
	// hide form
	hideCourseForm();
	// get existing object
	var id = document.querySelector('#add-course-form').getAttribute( 'courseID' );
	// set id
	if( id == null ) {
		// get last id
		id = localStorage.getItem( 'lastGradeItemID' ) || 0;
		id++;
		localStorage.setItem( 'lastGradeItemID', id );
	}
	// get last id
	var id = localStorage.getItem( 'lastCourseID' ) || 0;
	id++;
	localStorage.setItem( 'lastCourseID', id );
	// create a course object
	var courseObj = new Course( id, courseCode, courseName );
	// get courses
	var courseAry = JSON.parse( localStorage.getItem( 'courses' ) ) || {};
	// existing course
	if( !courseAry[ 'c'+id ] ) courseAry[ 'c'+id ] = {};
	// add to array
	courseAry[ 'c'+id ] = courseObj;
	// save course to local storage
	localStorage.setItem( 'courses', JSON.stringify( courseAry ) );
	// refresh display
	refreshCourseList();
}



/**
 * Displays the form for creating a new grade item
 */
function showGradeItemForm( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// show course form
	document.getElementById('add-grade-item-form').style.display = 'block';
}
function hideGradeItemForm( ev ) {
	// get form inputs
	var formItemName = document.querySelector('#add-grade-item-form #grade-item-name');
	var formItemWeight = document.querySelector('#add-grade-item-form #grade-item-weight');
	var formItemConGrade = document.querySelector('#add-grade-item-form #grade-item-con-grade');
	var formItemOptGrade = document.querySelector('#add-grade-item-form #grade-item-opt-grade');
	var formItemActGrade = document.querySelector('#add-grade-item-form #grade-item-act-grade');
	// clear form
	formItemName.value = '';
	formItemWeight.value = '';
	formItemConGrade.value = '';
	formItemOptGrade.value = '';
	formItemActGrade.value = '';
	// hide course form
	document.getElementById('add-grade-item-form').style.display = 'none';
}
/**
 * Saves the grade item information
 */
function saveGradeItem( ev ) {
	// prevent default button behaviour
	if( !ev ) var ev = window.event;
	if( ev.preventDefault ) ev.preventDefault();
	// get form inputs
	var formGradeItemName = document.querySelector('#add-grade-item-form #grade-item-name');
	var formGradeItemWeight = document.querySelector('#add-grade-item-form #grade-item-weight');
	var formGradeItemConGrade = document.querySelector('#add-grade-item-form #grade-item-con-grade');
	var formGradeItemOptGrade = document.querySelector('#add-grade-item-form #grade-item-opt-grade');
	var formGradeItemActGrade = document.querySelector('#add-grade-item-form #grade-item-act-grade');
	// get form value
	var courseID = document.querySelector('#course-details').getAttribute( 'courseID' );
	var itemName = formGradeItemName.value;
	var itemWeight = formGradeItemWeight.value;
	var conGrade = formGradeItemConGrade.value;
	var optGrade = formGradeItemOptGrade.value;
	var actGrade = formGradeItemActGrade.value;
	// hide form
	hideGradeItemForm();
	// get existing object
	var id = document.querySelector('#add-grade-item-form').getAttribute( 'gradeItemID' );
	// set id
	if( id == null ) {
		// get last id
		id = localStorage.getItem( 'lastGradeItemID' ) || 0;
		id++;
		localStorage.setItem( 'lastGradeItemID', id );
	}
	// create a grade item object
	var gradeItemObj = new GradeItem( id, courseID, itemName, itemWeight, conGrade, optGrade, actGrade );
	// get grade items
	var gradeItemAry = JSON.parse( localStorage.getItem( 'gradeItems' ) ) || {};
	// add to array
	if( !gradeItemAry[ 'c'+courseID ] ) gradeItemAry[ 'c'+courseID ] = {};
	if( !gradeItemAry[ 'c'+courseID ][ 'g'+id ] ) gradeItemAry[ 'c'+courseID ][ 'g'+id ] = {};
	gradeItemAry[ 'c'+courseID ][ 'g'+id ] = gradeItemObj;
	// save grade item to local storage
	localStorage.setItem( 'gradeItems', JSON.stringify( gradeItemAry ) );
	// refresh display
	refreshGradeItems();
}



/**
 * Used to sort Courses alphabetically by course code
 */
function sortCourses( a, b ) {
	return a.courseCode.toLowerCase() < b.courseCode.toLowerCase();
}

/**
 * Used to sort Grade Items by weight
 */
function sortGradeItems( a, b ) {
	return parseInt( a.weight ) < parseInt( b.weight );
}