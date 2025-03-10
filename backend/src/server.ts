import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const app = express()

type Employee = {
    id: string,
    firstname: string,
    lastname: string,
    age: number,
    isMarried: boolean
}

const employees: Employee[] = [
    { id: uuidv4(), firstname: 'Ethan', lastname: 'Doomer', age: 21, isMarried: false },
    { id: uuidv4(), firstname: 'John', lastname: 'Doe', age: 23, isMarried: false },
];

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    console.log('someone visiting the server')
    res.status(200).send('welcome to the server!')
})

app.get('/employees', (req: Request, res: Response) => {
    console.log('someone accessed the employees list.')
    res.status(200).json(employees)
})

app.get('/employees/search', (req: Request<{}, {}, {}, { firstname: string }>, res: Response) => {
    const { firstname } = req.query
    if (!firstname) {
        res.status(400).send('Please enter firstname')
        return
    }

    const searchedEmp = employees.filter(employee => employee.firstname.toLowerCase() === firstname.toLowerCase())
    if (searchedEmp.length === 0) {
        res.status(400).send('Employee not found')
    }

    console.log(`Employee ${firstname} was found`)
    res.status(200).json(searchedEmp)
})

app.get('/employees/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const empIndex = employees.findIndex(employee => employee.id === id)
    if (empIndex === -1) {
        console.log('something went wrong')
        res.status(404).send('Employee not found.')
        return
    }

    console.log('A employee was accessed by the id')
    res.status(200).send(employees[empIndex])
})

app.post('/employees', (req: Request, res: Response) => {
    const { firstname, lastname, age, isMarried } = req.body

    const newEmp: Employee = {
        id: uuidv4(),
        firstname,
        lastname,
        age,
        isMarried
    }

    const sameEmp = employees.find(employee => employee.firstname === req.body.firstname && employee.lastname === req.body.lastname)

    if (sameEmp) {
        res.status(400).send('The employee already exist.')
        return
    }

    employees.push(newEmp)
    console.log(`Employee ${req.body.firstname} ${req.body.lastname} is added successfully.`)
    res.status(201).json(newEmp)
})

app.put('/employees/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const empIndex = employees.findIndex(employee => employee.id === id)
    if (empIndex === -1) {
        res.status(404).send('Employee not found')
        return
    }

    employees[empIndex] = {...employees[empIndex], ...req.body}
    console.log(`Employee ${employees[empIndex].id} was updated successfully.`)
    res.status(200).send(employees[empIndex])
})

app.delete('/employees/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const empIndex = employees.findIndex(employee => employee.id === id)
    if (empIndex === -1) {
        res.status(404).send('Employee not found')
        return
    }

    employees.splice(empIndex, 1)
    console.log('Employee deleted')
    res.status(200).send(`Employee was deleted successfully`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})