const ROOT_URL = 'https://agile-dawn-31578.herokuapp.com/api/'

export function getTodaysStudents() {
	let url = `${ROOT_URL}students/today`
	return fetch(url, {
		method: 'GET'
	}).then((resp) => {
		return resp.json()
	})
}

export function signinStudent(student) {
	let url = `${ROOT_URL}students/${student.id}/signin`
	return fetch(url, {
		method: 'POST'
	}).then((resp) => {
		return resp.json()
	})	
}

export function signoutStudent(student) {
	let url = `${ROOT_URL}students/${student.id}/signout`
	return fetch(url, {
		method: 'POST'
	}).then((resp) => {
		return resp.json()
	})	
}

export function lateStudent(student) {
	let url = `${ROOT_URL}students/${student.id}/late`
	return fetch(url, {
		method: 'POST'
	}).then((resp) => {
		return resp.json()
	})	
}

export function addStudent(student) {
	let url = `${ROOT_URL}students`
	return fetch(url, {
		method: 'POST',
		body: student
	}).then((resp) => {
		return resp.json()
	})	
}