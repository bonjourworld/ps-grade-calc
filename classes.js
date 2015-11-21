/**
 * Local Storage:
 *
 * courses : [ ary ]
 * lastCourseID : [ n ] (auto_increment)
 *
 */

/**
 * Course Class
 * stores the following course info:
 * - id
 * - code
 * - name
 */
function Course( id, code, name ) {

	// PUBLIC
	//// variables
	this.courseID = id;
	this.courseCode = code;
	this.courseName = name;

	//// functions
	/*
	this.getID = function() {
		return courseID;
	}

	this.getCode = function() {
		return courseCode;
	}
	this.setCode = function( code ) {
		courseCode = code;
	}

	this.getName = function() {
		return courseName;
	}
	this.setName = function( name ) {
		courseName = name;
	}

	this.toString = function() {
		var obj = {};
		obj.id = this.getID();
		obj.code = this.getCode();
		obj.name = this.getName();
		return JSON.stringify( obj );
	}
	*/

	// PRIVATE

	//// functions

}


/**
 * Grade Item Class
 * stores the following grade item info:
 * - id
 * - course id
 * - name
 * - weight
 */
function GradeItem( id, courseID, name, weight, con, opt, act ) {

	// PUBLIC
	//// variables
	this.gradeItemID = id;
	this.courseID = courseID;
	this.name = name;
	this.weight = weight || 0;
	this.conGrade = con || 0;
	this.optGrade = opt || 0;
	this.actGrade = act || '';
}