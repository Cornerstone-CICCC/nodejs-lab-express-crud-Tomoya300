const employeeList = document.querySelector('.list-box ul')
const viewList = document.querySelector('.view-box')

let empList

const getEmployees = async () => {
    const res = await fetch("http://localhost:3000/employees", {
       method: "GET"
    });
 
    if (!res.ok) {
      throw new Error(`Failed to get employee: ${res.statusText}`);
    }
 
    const data = await res.json();

    empList = data
    console.log(empList)

    showEmps(empList)
 }
 
 const addEmployee = async (firstname, lastname, age, isMarried) => {
    const res = await fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
      },
      body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });
 
    if (!res.ok) {
      throw new Error(`Failed to add employees: ${res.statusText}`);
    }
 
    const data = await res.json(); // Returned employee data
    
    return data;
 };

 const editEmployee = async (id, firstname, lastname, age, isMarried) => {
    console.log(id)
    const res = await fetch(`http://localhost:3000/employees/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstname, lastname, age, isMarried })
    })

    if (!res.ok) {
        throw new Error (`Failed to edit employees: ${res.statusText}`)
    }

    const data = await res.json()
    
    return data
 }

 const searchEmp = async (firstname) => {
    const res = await fetch(`http://localhost:3000/employees/search?firstname=${firstname}`, {
        method: "GET"
    })

    if (!res.ok) {
        throw new Error (`Failed to search employees: ${res.statusText}`)
    }

    const data = await res.json()
    console.log(data)
    return data
 }

 const deleteEmp = async (id) => {
    const res = await fetch(`http://localhost:3000/employees/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error (`Failed to delete employee: ${res.statusText}`)
    }

    empList = empList.filter(emp => emp.id !== id)
    showEmps(empList)
    const text = await res.text()
    return text
 }

 function showEmps(employees) {
    employeeList.innerHTML = ''
    console.log(employees)
    employees.forEach(emp => {
        const li = document.createElement('li')
        
        const name = document.createElement('span')
        const id = document.createElement('span')
        const viewBtn = document.createElement('button')
        const deleteBtn = document.createElement('button')

        name.textContent = `${emp.firstname} ${emp.lastname}`
        name.classList.add('name')
        id.textContent = emp.id
        id.classList.add('hidden', 'id')

        viewBtn.textContent = 'VIEW'
        viewBtn.classList.add('view-btn')
        deleteBtn.textContent = 'DELETE'
        deleteBtn.classList.add('delete-btn')

        viewBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const thisEmpLi = e.target.closest('li')
            const empId = thisEmpLi.querySelector('.id').textContent
            console.log(thisEmpLi)
            empList.forEach(emp => {
                if (emp.id === empId) {
                    viewEmp(emp)
                }
            })
        })

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const thisEmpLi = e.target.closest('li')
            const empId = thisEmpLi.querySelector('.id').textContent

            deleteEmp(empId)
        })

        li.append(name, id, viewBtn, deleteBtn)

        employeeList.appendChild(li)
    })
 }

 const addForm = document.querySelector('.add-form')
 addForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstname = document.getElementById('add-fname').value
    const lastname = document.getElementById('add-lname').value
    const age = document.getElementById('add-age').value
    const isMarried = document.getElementById('add-married').checked

    const newEmp = await addEmployee(firstname, lastname, age, isMarried)
    getEmployees()
    
    addForm.reset()
 })

const editForm = document.querySelector('.edit-form')
editForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstname = document.getElementById('edit-fname').value
    const lastname = document.getElementById('edit-lname').value
    const age = document.getElementById('edit-age').value
    const isMarried = document.getElementById('edit-married').checked

    let id
    empList.forEach(emp => {
        if (emp.firstname === firstname) {
            id = emp.id
        }
    })

    const editedEmp = await editEmployee(id, firstname, lastname, age, isMarried)
    console.log(id)
    empList = empList.map(emp => emp.id === id ? editedEmp : emp)
    showEmps(empList)

    editForm.reset()
})

const searchForm = document.querySelector('.search-form')
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstname = document.getElementById('search').value
    console.log(firstname)
    const searchedEmp = await searchEmp(firstname)
    console.log(searchedEmp)
    if (searchedEmp.length > 0) {
        viewEmp(searchedEmp[0]) 
    } else {
        viewList.innerHTML = 'No employee found'
    }

    searchForm.reset()
})

function viewEmp(employee) {
    viewList.innerHTML = ''
    const ul = document.createElement('ul')
    ul.innerHTML = `
        <li>First name: ${employee.firstname}</li>
        <li>Last name: ${employee.lastname}</li>
        <li>Age: ${employee.age}</li>
        <li>Married: ${employee.isMarried ? 'Yes' : 'No'}</li>
    `

    viewList.appendChild(ul)
}

 getEmployees()