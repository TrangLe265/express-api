const express = require('express');
const Joi = require('joi'); //Joi is a class, so we should name it with Pascal convention
const dotenv = require('dotenv');
const app = express();

app.use(express.json()); //a middleware that enables express to handle json
dotenv.config({path: '.env'}); 

const courses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 5,
    department: 'Computer Science',
    level: 'Bachelor'
  },
  {
    id: 2,
    code: 'CS201',
    name: 'Data Structures and Algorithms',
    credits: 5,
    department: 'Computer Science',
    level: 'Bachelor'
  },
  {
    id: 3,
    code: 'CS301',
    name: 'Databases and Information Systems',
    credits: 5,
    department: 'Computer Science',
    level: 'Bachelor'
  },
  {
    id: 4,
    code: 'CS401',
    name: 'Software Engineering',
    credits: 5,
    department: 'Computer Science',
    level: 'Bachelor'
  },
  {
    id: 5,
    code: 'AI501',
    name: 'Introduction to Artificial Intelligence',
    credits: 5,
    department: 'Computer Science',
    level: 'Master'
  },
  {
    id: 6,
    code: 'SE502',
    name: 'Cloud Computing and DevOps',
    credits: 5,
    department: 'Software Engineering',
    level: 'Master'  
  },
  {
    id: 7,
    code: 'UX101',
    name: 'User Experience Design',
    credits: 3,
    department: 'Design',
    level: 'Bachelor'
  },
  {
    id: 8,
    code: 'BUS201',
    name: 'Entrepreneurship and Innovation',
    credits: 4,
    department: 'Business',
    level: 'Bachelor'
  }
];

app.get('/', (req,res) => {
    res.send('Server is ready to connect!'); 
}); 

app.get('/courses', (req,res) => {
    res.send(courses); 
})

app.get('/courses/:id', (req,res) => {
    const id = Number(req.params.id); 
    if (isNaN(id)){
      return res.status(400).json({"message": "id provided must be a number"})
    }

    const result = courses.find((course) => course.id === id);
    if (!result) 
      return res.status(404).json({'message': `Course with the provided id doesnt not exist`}) 

    return res.json(result);  
})

app.post('/courses', (req,res) => {
    const {id, code, name, credits, department,level} = req.body; //req.body is already an object 
    const newCourse = {id, code, name, credits, department,level}; 

    const {error} = validateCourse(newCourse); 
    console.log(error)
    if (error){
      return  res.status(400).send(error.details[0].message)
    }

    courses.push(newCourse);
    res.status(201).json({
        message:'successfully added new course',
        course: newCourse
    })
})

app.delete('/courses/:id', (req,res)=> {
  const id = Number(req.params.id); 
  if (isNaN(id)){
    return res.status(400).json({"message": "id provided must be a number"})
  }
  const indexToDelete = courses.findIndex((course) => course.id === id);
  if (!indexToDelete) {
    return res.status(404).json({'message': `Course with the provided id does not exist`}); 
  }
  courses.splice(indexToDelete,1); 
  return res.status(200).json({'message': `Successfully delete course with id ${id}`})
  
})

app.put('/courses/:id', (req,res) => {
  //look up the course to see if it exits
  const id = Number(req.params.id); 
  if (isNaN(id)){
      return res.status(400).json({"message": "id provided must be a number"})
    }

  const courseIndex = courses.findIndex((course) => course.id === id); //findIndex method returns an index, while FIND method returns an object
    if (courseIndex === -1) 
      return res.status(404).json({'message': `Course with the provided id does not exist`}) 
  
  //validate the PUT body
  const {error} = validateCourse(req.body); //object destructer
  if (error){
    return res.status(400).send(error.details[0], schema); //result.error.details[0]: this is just how a Joi error object is laid out
    
  }

  //perform the update
  const {code, name, credits, department,level} = req.body;
  courses[courseIndex] = {id, code, name, credits, department,level}; 

  res.json(courses[courseIndex]); 

})

function validateCourse(course){
  const schema = Joi.object({
        id: Joi.required(),
        name: Joi.string().min(3).required(),
        code: Joi.string().min(3).required(),
        credits: Joi.number().required(),
        department: Joi.string().required(),
        level: Joi.string().required()
    }); 
  
  const result = schema.validate(course); 
  console.log(result); 
  return result; 
}

const port = process.env.PORT || 3000; 
console.log(port);
app.listen(port, () => console.log(`Server is running on port ${port} `)); 